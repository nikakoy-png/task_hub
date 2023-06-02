import qrcode
from django.http import HttpResponse


class QRCode:
    @staticmethod
    def generate_qrcode(request, hashcode):
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )

        qr.add_data(f'http://localhost:3000/accept/invite/{hashcode}')
        qr.make(fit=True)

        qr_image = qr.make_image(fill_color="black", back_color="white")

        response = HttpResponse(content_type="image/png")
        qr_image.save(response, "PNG")
        return response
