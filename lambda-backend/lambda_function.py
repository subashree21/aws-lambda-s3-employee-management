import json
import os
import uuid
from datetime import date
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body, default=str)
    }


def lambda_handler(event, context):
    method = event.get("requestContext", {}).get(
        "http", {}
    ).get("method", "GET")

    path = event.get("rawPath", "/").rstrip("/") or "/"

    if method == "OPTIONS":
        return response(200, {"message": "CORS preflight"})

    if path == "/":
        return response(200, {
            "message": "Employee Management API Running"
        })

    if path == "/employees" and method == "GET":
        result = table.scan()
        employees = result.get("Items", [])

        while result.get("LastEvaluatedKey"):
            result = table.scan(
                ExclusiveStartKey=result["LastEvaluatedKey"]
            )
            employees.extend(result.get("Items", []))

        employees.sort(
            key=lambda emp: emp.get("created_at", ""),
            reverse=True
        )
        return response(200, employees)

    if path == "/employees" and method == "POST":
        data = json.loads(event.get("body") or "{}")

        required = [
            "employee_id", "full_name", "email", "phone",
            "department", "designation", "salary", "joining_date"
        ]

        if any(not data.get(field) for field in required):
            return response(400, {
                "error": "All employee fields are required"
            })

        try:
            date.fromisoformat(data["joining_date"])
            salary = Decimal(str(data["salary"]))
            if not salary.is_finite() or salary < 0:
                raise ValueError("Invalid salary")
        except (ValueError, TypeError):
            return response(400, {
                "error": "Invalid joining date or salary"
            })

        existing = table.scan(
            FilterExpression=Attr("employee_id").eq(
                data["employee_id"]
            ),
            ProjectionExpression="id",
            Limit=1
        )

        if existing.get("Items"):
            return response(409, {
                "error": "Employee ID already exists"
            })

        item = {
            "id": str(uuid.uuid4()),
            "employee_id": data["employee_id"],
            "full_name": data["full_name"],
            "email": data["email"],
            "phone": data["phone"],
            "department": data["department"],
            "designation": data["designation"],
            "salary": salary,
            "joining_date": data["joining_date"],
            "created_at": date.today().isoformat()
        }

        table.put_item(Item=item)
        return response(201, {
            "message": "Employee added successfully",
            "id": item["id"]
        })

    parts = path.split("/")

    if (
        len(parts) == 3
        and parts[1] == "employees"
        and parts[2]
    ):
        employee_id = parts[2]

        if method == "PUT":
            data = json.loads(event.get("body") or "{}")
            required = [
                "employee_id", "full_name", "email", "phone",
                "department", "designation", "salary", "joining_date"
            ]

            if any(not data.get(field) for field in required):
                return response(400, {
                    "error": "All employee fields are required"
                })

            try:
                date.fromisoformat(data["joining_date"])
                salary = Decimal(str(data["salary"]))
                if not salary.is_finite() or salary < 0:
                    raise ValueError("Invalid salary")
            except (ValueError, TypeError):
                return response(400, {
                    "error": "Invalid joining date or salary"
                })

            existing = table.get_item(
                Key={"id": employee_id}
            ).get("Item")

            if not existing:
                return response(404, {
                    "error": "Employee not found"
                })

            duplicate = table.scan(
                FilterExpression=(
                    Attr("employee_id").eq(data["employee_id"])
                    & Attr("id").ne(employee_id)
                ),
                ProjectionExpression="id",
                Limit=1
            )

            if duplicate.get("Items"):
                return response(409, {
                    "error": "Employee ID already exists"
                })

            table.update_item(
                Key={"id": employee_id},
                UpdateExpression=(
                    "SET employee_id=:eid, full_name=:name, "
                    "email=:email, phone=:phone, "
                    "department=:dept, designation=:desig, "
                    "salary=:salary, joining_date=:joining"
                ),
                ExpressionAttributeValues={
                    ":eid": data["employee_id"],
                    ":name": data["full_name"],
                    ":email": data["email"],
                    ":phone": data["phone"],
                    ":dept": data["department"],
                    ":desig": data["designation"],
                    ":salary": salary,
                    ":joining": data["joining_date"]
                }
            )

            return response(200, {
                "message": "Employee updated successfully"
            })

        if method == "DELETE":
            existing = table.get_item(
                Key={"id": employee_id}
            ).get("Item")

            if not existing:
                return response(404, {
                    "error": "Employee not found"
                })

            table.delete_item(Key={"id": employee_id})
            return response(200, {
                "message": "Employee deleted successfully"
            })

    return response(404, {"error": "Route not found"})
