---
# SAMPLE project: a single file with no images, so the card shows a placeholder.
title: Gameplay Programming
description: The golem's movement and the rebuild mechanic.
production: moss-and-stone
role: Gameplay Programmer
disciplines: [code, game-design]
tools: [Godot, GDScript]
date: 2026-08-20
links:
  - { label: Source on GitHub, url: https://github.com }
draft: true
---

Explain the system, then show the interesting part of the code. Code blocks are highlighted automatically.

```gdscript
func _physics_process(delta: float) -> void:
	var input := Input.get_vector("left", "right", "forward", "back")
	var target := Vector3(input.x, 0.0, input.y) * speed
	velocity = velocity.move_toward(target, acceleration * delta)
	move_and_slide()
```

## The rebuild mechanic

Walk through how it works, which alternatives you tried, and why you picked this one.
