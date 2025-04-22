# IDOR Practice Lab

A deliberately vulnerable REST API that lets you practice finding and exploiting
Insecure Direct Object References (IDOR) / Broken Object Level Authorization (BOLA).

## Quick Start (Docker)

```bash
# 1. Unzip the repo and cd in
docker-compose up --build
```

The API listens on **http://localhost:3000**.

## Getting a Token

```bash
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"userId":1}'
# → { "token": "eyJ..." }
```

## Exercises

| # | Goal | Hint |
|---|------|------|
| 1 | Horizontal IDOR – read Bob’s profile while logged in as Alice | `GET /api/users/2` |
| 2 | Horizontal IDOR – access someone else’s order | `GET /api/orders/102` |
| 3 | File IDOR – download Bob’s private file | `GET /api/files/2/download` |
| 4 | **Bonus**: Write a script that enumerates `/api/users/{id}` 1‑100 and extracts emails. |

## Fix‑It Challenge

* Add an ownership check to every endpoint  
* Swap predictable numeric IDs for UUIDs scoped per tenant  
* Centralize authorization logic in middleware

## Disclaimers

*For educational use only. Do **not** expose this lab to the open internet.*