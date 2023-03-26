# Introduction

This repository contains the reproduction of an issue encountered with the [typeorm npm package](https://www.npmjs.com/package/typeorm) v0.3.12.

## High-level summary

When using [eager relations](https://typeorm.io/eager-and-lazy-relations#eager-relations), TypeORM sometimes generates queries where different columns have the same aliases (`AS "<alias>"`), which causes some primitive properties to be "bound" twice, the result being that these properties are arrays at runtime.
The same issue doesn't appear when using the [`relations` property](https://typeorm.io/find-options#basic-options) of the several `find` methods.

This repository defines two entities:

1. A parent entity, and
1. A child entity, with a one-to-one relation to the parent.

## Prerequisites

### Create a SQL Server container

```console
docker-compose up -d
```

### Set up the database and some data

```console
npm install

run run database:set-up
```

## Repro

### Eager relations

```console
npm run start:eager
```

This npm script runs the [`src/eager/run.ts` file](./src/eager/run.ts), which runs the following query:

```ts
// Get parents using eager relations
const parents = await eagerDataSource.manager.getRepository(ParentEntity).find()
console.log(JSON.stringify(parents[0], null, 2))
```

The executed SQL query contains duplicate aliases:

```sql
SELECT "ParentEntity"."id"         AS "ParentEntity_id",
       "ParentEntity"."name"       AS "ParentEntity_name",
                                   -- 👇 duplicate aliases
       "ParentEntity"."child_id"   AS "ParentEntity_child_id",
       "ParentEntity_child"."id"   AS "ParentEntity_child_id",
       "ParentEntity_child"."name" AS "ParentEntity_child_name"
FROM "parent" "ParentEntity"
LEFT JOIN "child" "ParentEntity_child"
ON "ParentEntity_child"."id" = "ParentEntity"."child_id"
```

The result, as shown in the console, is that the child entity has its `id` property set as an array:

```json
{
  "id": "402477F9-C7B1-4B45-B0CA-5C6FCE5A6E25",
  "name": "Parent entity",
  "child": {
    "id": ["5B7350CB-3080-4693-8337-8569A305E0E6", "5B7350CB-3080-4693-8337-8569A305E0E6"],
    "name": "Child entity"
  }
}
```

### Relations

```console
npm run start:relations
```

This script does the same as the previous, but uses the following query:

```ts
const parents = await relationsDataSource.manager.getRepository(ParentEntity).find({
  relations: {
    child: true,
  },
})

console.log(JSON.stringify(parents[0], null, 2))
```

The SQL query uses a different aliasing method, which prevents duplicate aliases:

```sql
SELECT "ParentEntity"."id"                       AS "ParentEntity_id",
       "ParentEntity"."name"                     AS "ParentEntity_name",
                                                 -- 👇 No duplicate aliases
       "ParentEntity"."child_id"                 AS "ParentEntity_child_id",
       "ParentEntity__ParentEntity_child"."id"   AS "ParentEntity__ParentEntity_child_id",
       "ParentEntity__ParentEntity_child"."name" AS "ParentEntity__ParentEntity_child_name"
FROM "parent" "ParentEntity"
LEFT JOIN "child" "ParentEntity__ParentEntity_child"
ON "ParentEntity__ParentEntity_child"."id" = "ParentEntity"."child_id"
```

As a result, the child entity has its `id` property set as a string as expected:

```json
{
  "id": "402477F9-C7B1-4B45-B0CA-5C6FCE5A6E25",
  "name": "Parent entity",
  "child": {
    "id": "5B7350CB-3080-4693-8337-8569A305E0E6",
    "name": "Child entity"
  }
}
```

### Notes

It's worth noting that this example uses a custom naming strategy using snake case, see [the `src/snake-naming-strategy.ts` file](./src/snake-naming-strategy.ts).
When using the default naming strategy, the issue doesn't appear with eager relations.

However, given there's no issue when using this custom naming strategy along with relations, we think there might be a way to fix it.
