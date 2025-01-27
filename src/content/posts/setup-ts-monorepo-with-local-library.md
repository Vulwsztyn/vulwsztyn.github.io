---
title: Setup TS monorepo with local library
published: 2025-01-27
description: ''
image: ''
tags: [typescript, monorepo, hello-world]
category: 'typescript'
draft: false 
lang: ''
---

# What is this about?

This post will showcase the extremely basic setup of a monorepo that will contain a local ts library and a next.js project as siblings:

```
.
+-- my-library
+-- next-js-project
```

I will be using [next-starter](https://github.com/nextjs/saas-starter) as the next js project, but this should not be required.

## Prerequisite

[pnpm](https://pnpm.io/)

## TLDR

If you have the aforementioned directory structure and build to `my-library/dist` you can just add `"my-library": "file:../my-library/dist",` to dependencies in `next-js-project`.

# Steps

## Clone or create the next js project

`git clone git@github.com:nextjs/saas-starter.git`

If like me you are using the [next-starter](https://github.com/nextjs/saas-starter) perform all the necessary setup described in its `README.md`.

Remove `.git` dir from the next js project.

## Add the test route

Create the file `./app/api/test/route.ts` with the following content.

```
import { NextRequest, NextResponse } from 'next/server'
export async function GET(request: NextRequest) {
  const params = request?.nextUrl?.searchParams
  const a = parseInt(params.get('a')??'0')
  const b = parseInt(params.get('b')??'0')
  return NextResponse.json({ value: a+b })
}
```

When you run the server you can go to http://localhost:3000/api/test?a=2&b=3 in your browser and see the response `{"value":5}`.

## Setup the local library

```
mkdir my-library 
cd my-library 
pnpm init 
pnpm i -D tsup typescript
```

or as one:

`mkdir my-library && cd my-library && pnpm init && pnpm i -D tsup typescript`

create a file with the sample function to be imported under `my-library/src/index.ts`:
```
const myAdd = (a: number, b: number): number => a + b + 7
export { myAdd }
```

in `package.json` scripts add: `"build": "tsup src/index.ts --format cjs,esm --dts"`

run `pnpm build`

## Bind it together

Add `"my-library": "file:../my-library/dist",` to `package.json` in next js project.

run `pnpm i`

Change the code under `./app/api/test/route.ts` to:
```
import { NextRequest, NextResponse } from 'next/server'
import {myAdd} from 'my-library'
export async function GET(request: NextRequest) {
  const params = request?.nextUrl?.searchParams
  const a = parseInt(params.get('a')??'0')
  const b = parseInt(params.get('b')??'0')
  return NextResponse.json({ value: myAdd(a,b) })
}
```

You can go to http://localhost:3000/api/test?a=2&b=3 in your browser and see the response `{"value":12}`.
