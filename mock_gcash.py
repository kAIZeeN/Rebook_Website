import json
import html
import uuid
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = 8080
PAYMENTS = {}
STATUS = {"approve": "CO", "decline": "CA"}


class Handler(BaseHTTPRequestHandler):
    def _json(self, code, body):
        data = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _html(self, body):
        data = body.encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path != "/mock/direct":
            return self._json(404, {"status": "ERROR", "message": "not found"})
        try:
            length = int(self.headers.get("Content-Length", 0))
            req = json.loads(self.rfile.read(length) or b"{}")
        except ValueError:
            return self._json(400, {"status": "ERROR", "message": "Invalid JSON"})

        p = req.get("payment") or {}
        required = [
            "name", "email", "country", "phone_number",
            "payment_type_code", "merchant_payment_code",
            "currency_code", "amount_total"
        ]
        missing = [field for field in required if not p.get(field)]
        if missing:
            return self._json(400, {
                "status": "ERROR",
                "message": f"Missing fields: {', '.join(missing)}"
            })

        if p["payment_type_code"] != "g-cash" or p["country"] != "ph" or p["currency_code"] != "PHP":
            return self._json(400, {
                "status": "ERROR",
                "message": "Mock supports g-cash / ph / PHP only"
            })

        h = uuid.uuid4().hex
        PAYMENTS[h] = {
            "hash": h,
            "country": "ph",
            "merchant_payment_code": p["merchant_payment_code"],
            "status": "PE",
            "amount_ext": p["amount_total"],
            "currency_ext": "PHP",
            "payment_type_code": "g-cash",
            "redirect_url": p.get("redirect_url"),
        }

        merchant_redirect = PAYMENTS[h].get("redirect_url")
        if merchant_redirect:
            separator = "&" if "?" in merchant_redirect else "?"
            PAYMENTS[h]["redirect_url"] = f"{merchant_redirect}{separator}hash={h}"

        pay = dict(PAYMENTS[h])
        pay["redirect_url"] = f"http://localhost:{PORT}/mock-gcash/{h}"
        return self._json(200, {"payment": pay, "status": "SUCCESS"})

    def do_GET(self):
        url = urllib.parse.urlparse(self.path)
        qs = urllib.parse.parse_qs(url.query)

        if url.path == "/":
            return self._html(
                "<!doctype html><html lang='en'><meta charset='utf-8'>"
                "<meta name='viewport' content='width=device-width, initial-scale=1'>"
                "<title>Mock GCash</title>"
                "<style>body{font:16px system-ui,sans-serif;max-width:620px;"
                "margin:12vh auto;padding:24px;color:#222}a{color:#17358e}"
                "code{background:#eee;padding:3px 6px;border-radius:4px}</style>"
                "<h1>Mock GCash is ready</h1>"
                "<p>This local server simulates a GCash checkout for testing.</p>"
                "<p>To start a mock payment, open "
                "<a href='http://localhost:3000/donatemoney.html'>"
                "the ReBook donation page</a> and submit the form.</p>"
                "<p>This URL is only the mock server; it is not the payment page.</p>"
                "</html>"
            )

        if url.path == "/mock/query":
            h = (qs.get("hash") or [""])[0]
            if h not in PAYMENTS:
                return self._json(404, {"status": "ERROR", "message": "payment not found"})
            return self._json(200, {"payment": PAYMENTS[h], "status": "SUCCESS"})

        if url.path.startswith("/mock-gcash/"):
            h = url.path.rsplit("/", 1)[-1]
            pay = PAYMENTS.get(h)
            if not pay:
                return self._json(404, {"status": "ERROR", "message": "payment not found"})

            action = (qs.get("action") or [""])[0]
            if action in STATUS and pay["status"] == "PE":
                pay["status"] = STATUS[action]

            if pay["status"] != "PE":
                back = pay.get("redirect_url")
                link = (
                    f'<a class="return-link" href="{html.escape(back, quote=True)}">'
                    "Return to ReBook</a>"
                    if back else ""
                )
                label = "Confirmed" if pay["status"] == "CO" else "Cancelled"
                return self._html(self._checkout_page(
                    f"Payment {label}",
                    f"Your mock payment is {label.lower()}.",
                    link
                ))

            amount = html.escape(str(pay["amount_ext"]))
            order = html.escape(str(pay["merchant_payment_code"]))
            return self._html(self._checkout_page(
                "Confirm payment",
                "Review your donation details before continuing.",
                (
                    f'<div class="amount">₱{amount}<small>PHP</small></div>'
                    f'<div class="detail"><span>Merchant</span><strong>ReBook</strong></div>'
                    f'<div class="detail"><span>Reference</span><strong>{order}</strong></div>'
                    '<div class="actions">'
                    '<a class="primary" href="?action=approve">Approve payment</a>'
                    '<a class="secondary" href="?action=decline">Decline</a>'
                    '</div>'
                )
            ))

        self._json(404, {"status": "ERROR", "message": "not found"})

    def _checkout_page(self, heading, description, content):
        return (
            "<!doctype html><html lang='en'><head><meta charset='utf-8'>"
            "<meta name='viewport' content='width=device-width, initial-scale=1'>"
            "<title>GCash | Mock Checkout</title><style>"
            "*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;"
            "place-items:center;padding:24px;background:#f2f5fa;color:#17233c;"
            "font:15px Arial,Helvetica,sans-serif}.card{width:min(100%,420px);"
            "overflow:hidden;border-radius:20px;background:#fff;box-shadow:"
            "0 18px 55px #18325b1c}.top{padding:24px 28px;background:#0875e1;"
            "color:#fff}.brand{display:flex;align-items:center;gap:10px;"
            "font-size:20px;font-weight:700}.brand img{width:38px;height:38px;"
            "padding:4px;border-radius:50%;background:#fff}.content{padding:28px}"
            "h1{margin:0 0 8px;font-size:23px}.hint{margin:0 0 25px;color:#718096;"
            "line-height:1.5}.amount{margin:0 0 24px;color:#0875e1;font-size:40px;"
            "font-weight:700}.amount small{margin-left:8px;font-size:13px;"
            "font-weight:600;color:#718096}.detail{display:flex;justify-content:"
            "space-between;gap:12px;padding:13px 0;border-top:1px solid #e8edf4}"
            ".detail span{color:#718096}.detail strong{text-align:right;"
            "overflow-wrap:anywhere}.actions{display:grid;gap:10px;margin-top:24px}"
            ".actions a,.return-link{display:block;padding:14px;text-align:center;"
            "border-radius:10px;text-decoration:none;font-weight:700}.primary,"
            ".return-link{background:#0875e1;color:#fff}.secondary{border:1px solid "
            "#d8e1ed;color:#5e6c82}.notice{padding:13px 28px;background:#edf6ff;"
            "color:#35638e;text-align:center;font-size:12px;line-height:1.5}"
            "@media(max-width:420px){body{padding:12px}.content{padding:24px}}"
            "</style></head><body><main class='card'><header class='top'>"
            "<div class='brand'><img src='http://localhost:3000/assets/images/"
            "gcash-logo.png' alt=''><span>GCash</span></div></header>"
            f"<section class='content'><h1>{heading}</h1>"
            f"<p class='hint'>{description}</p>{content}</section>"
            "<footer class='notice'>DEMO ONLY · This is a local mock checkout. "
            "No real GCash payment will be made.</footer></main></body></html>"
        )


if __name__ == "__main__":
    print(f"Mock GCash running on http://localhost:{PORT}")
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
