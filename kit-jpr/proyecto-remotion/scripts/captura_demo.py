# Genera demo/captura-demo.png: una página genérica (sin marca real) para probar la pieza Captura.
# Uso: python3 scripts/captura_demo.py
from PIL import Image, ImageDraw, ImageFont
W, H = 1600, 1000
F = '../fuentes/'
b = lambda s: ImageFont.truetype(F + 'Poppins-Bold.ttf', s)
m = lambda s: ImageFont.truetype(F + 'Poppins-Medium.ttf', s)
r = lambda s: ImageFont.truetype(F + 'Poppins-Regular.ttf', s)
NAVY, GRIS, CLARO, LINEA = (10, 31, 68), (138, 148, 166), (244, 246, 250), (226, 230, 238)
im = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(im)
d.rectangle([0, 0, W, 64], fill=CLARO)
for i, c in enumerate([(220, 224, 232)] * 3): d.ellipse([28 + i * 34, 22, 48 + i * 34, 42], fill=c)
d.rounded_rectangle([200, 16, 1000, 48], 16, fill='white')
d.text((228, 19), 'panel.ejemplo.com/campanas', font=r(22), fill=GRIS)
d.text((80, 120), 'Biblioteca de anuncios', font=b(56), fill=NAVY)
d.text((80, 200), 'Resultados de la búsqueda en todas las plataformas', font=r(30), fill=GRIS)
# dato a resaltar
d.text((80, 300), '1.240 anuncios', font=b(44), fill=NAVY)
w = d.textlength('1.240 anuncios', font=b(44))
d.text((80 + w + 16, 306), 'activos', font=m(40), fill=NAVY)
print('marcador', 80 / W, 300 / H, w / W, 66 / H)
# tarjetas
y0 = 410
for i in range(3):
    x = 80 + i * 490
    d.rounded_rectangle([x, y0, x + 450, y0 + 500], 22, outline=LINEA, width=3, fill='white')
    d.rounded_rectangle([x + 24, y0 + 24, x + 426, y0 + 250], 14, fill=CLARO)
    d.rounded_rectangle([x + 24, y0 + 280, x + 330, y0 + 306], 10, fill=LINEA)
    d.rounded_rectangle([x + 24, y0 + 326, x + 260, y0 + 350], 10, fill=LINEA)
    d.text((x + 24, y0 + 390), 'Activo', font=m(28), fill=NAVY)
    d.rounded_rectangle([x + 300, y0 + 380, x + 426, y0 + 436], 28, fill=NAVY)
    d.text((x + 326, y0 + 389), 'Ver', font=m(28), fill='white')
im.save('demo/captura-demo.png')
print('recuadro', 70 / W, 290 / H, (w + 16 + 150 + 20) / W, 86 / H)
