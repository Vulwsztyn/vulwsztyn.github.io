---
title: Advent of Code 2024 day 2 in Unreal blueaprints
published: 2025-01-23
description: 'My solution to day 2 of 2024 Advent of Code in Unreal blueprints'
image: 'Check Array With Mistake.png'
tags: [Advent-of-Code, Unreal, Unholy]
category: 'Advent-of-Code'
draft: true 
---
:::warning
Potential spoilers regarding part 2 of the aforementioned AoC puzzle.
:::

https://adventofcode.com/2024/day/2

As a reminder to anyone who does not remember AoC puzzles by heart: this day's puzzle required us to create code that would count how many lines in the text file contained "safe" reports. A report was an array of positive integers and the safe ones were the ones that were [monotonic](https://en.wikipedia.org/wiki/Monotonic_function) and whose consecutive values differed by at least 1 and at most 3. That's it for part 1 of this day.

For part 2 we needed to broaden the definition of safeness to include those unsafe reports that would be safe after removal of exactly one element.

My boring and surely suboptimal solution in python can be found in my [Advent of Code repo](https://github.com/Vulwsztyn/advent-of-code/blob/main/2024/day02/main.py).

What follows are the screenshots including the recreation of the code in that repo in Unreal blueprints.

