# -*- coding: utf-8 -*-
"""赤色观测站 · 程序化背景 v4"""
import numpy as np
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

W, H = 2560, 1440
rng = np.random.default_rng(20261031)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
nx, ny = xx / W, yy / H

def falloff(cx, cy, rx, ry, p=1.0):
    d = np.sqrt(((nx - cx) / rx) ** 2 + ((ny - cy) / ry) ** 2)
    return np.clip(1.0 - d, 0, 1) ** p

img = np.zeros((H, W, 3), np.float32)
img[..., 0], img[..., 1], img[..., 2] = 3, 1, 3

g = falloff(0.30, 0.26, 1.05, 0.75, 1.2) * 0.7 + falloff(0.80, 0.62, 0.75, 0.55, 1.4) * 0.45
img += g[..., None] * np.array([30, 6, 11], np.float32)

def cloud_layer(seeds, blur, gain, tint):
    layer = np.zeros((H, W), np.float32)
    for cx, cy, rx, ry, s in seeds:
        layer += falloff(cx, cy, rx, ry, 1.6) * s
    layer = np.clip(layer, 0, 1.4)
    im = Image.fromarray((layer * 120).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur))
    a = np.array(im, np.float32) / 120.0 * gain
    return a[..., None] * np.array(tint, np.float32)

img += cloud_layer([(0.16, 0.70, 0.20, 0.16, 1.0), (0.44, 0.58, 0.24, 0.13, 0.6), (0.74, 0.14, 0.22, 0.13, 0.85)], 55, 0.60, (155, 24, 46))
img += cloud_layer([(0.55, 0.36, 0.32, 0.22, 0.7), (0.93, 0.40, 0.15, 0.17, 1.0)], 150, 0.30, (80, 8, 34))

d1 = np.exp(-(((ny - 0.54) - 0.55 * (nx - 0.5)) / 0.10) ** 2)
img *= (1 - d1[..., None] * 0.35)

# ---------- 黑洞 ----------
lcx, lcy = 0.735, 0.395
dx, dy = nx - lcx, ny - lcy
rho = np.sqrt((dx / 0.205) ** 2 + (dy / 0.108) ** 2)
light = np.zeros((H, W), np.float32)
ring = np.exp(-((rho - 1.0) / 0.030) ** 2)
ang = np.arctan2(dy, dx)
ring *= 0.60 + 0.60 * np.clip(-np.sin(ang), 0, 1)
light += ring * 1.35
light += np.exp(-((rho - 1.16) / 0.008) ** 2) * 0.30
disk = np.exp(-((dy + 0.010) / 0.018) ** 2) * np.clip(1 - np.abs(dx) / 0.40, 0, 1) ** 1.2
light += disk * 0.60
light += np.exp(-((rho - 1.0) / 0.50) ** 2) * 0.10

bloom_src = (light * 255).clip(0, 255).astype(np.uint8)
bloom = np.array(Image.fromarray(bloom_src).filter(ImageFilter.GaussianBlur(30)), np.float32) / 255
img += bloom[..., None] * np.array([95, 22, 36], np.float32)
img += light[..., None] * np.array([255, 126, 148], np.float32) * 0.95

hole = np.clip(1.0 - (rho / 0.88) ** 2, 0, 1) ** 0.30
img *= (1 - hole[..., None] * 0.995)
img += hole[..., None] * np.array([6, 1, 3], np.float32)
img += np.exp(-((rho - 0.885) / 0.006) ** 2)[..., None] * np.array([170, 54, 70], np.float32)

# ---------- 地平线 ----------
arc = 0.885 - 0.075 * ((nx - 0.44) ** 2) / 0.25
below = np.clip((ny - arc) * 1500, 0, 1)
rim = np.exp(-((ny - arc) * 260) ** 2)
img *= (1 - below[..., None] * 0.72)
img += rim[..., None] * np.array([86, 24, 33], np.float32)
# 极轻的地表起伏（低频，不要条纹）
surf = (np.sin(nx * 9.0) * 0.6 + np.sin(nx * 21.0 + 1.3) * 0.4) * 0.5 + 0.5
img += (below * surf * 3.0)[..., None] * np.array([55, 13, 19], np.float32)
grain = np.array(Image.fromarray((rng.random((H, W)) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0)), np.float32) / 255
img += (below * (grain - 0.5) * 0.8)[..., None] * np.array([70, 18, 26], np.float32)
# 远处零星灯火
for _ in range(26):
    lx = int(rng.random() * W)
    ly = int((float(arc[0, min(W - 1, lx)]) + 0.012 + rng.random() * 0.035) * H)
    if 0 <= ly < H:
        img[max(0, ly - 1):ly + 2, lx:lx + 2] += np.array([90, 26, 30], np.float32)

# ---------- 星点（先画星，再被黑洞/前景遮） ----------
def add_stars(img, count, mags_max, cross=False):
    a = np.zeros((H, W), np.float32)
    sx = rng.random(count) * W
    sy = rng.random(count) * H
    dens = 0.30 + 0.70 * np.clip(1 - np.sqrt(((sx / W - 0.4) / 0.95) ** 2 + ((sy / H - 0.4) / 0.95) ** 2), 0, 1)
    m = rng.random(count) < dens
    sx, sy = sx[m], sy[m]
    mag = rng.power(2.6, len(sx)) * mags_max + 0.25
    for xi, yi, mm in zip(sx, sy, mag):
        ix, iy = int(xi), int(yi)
        if 0 <= iy < H - 1 and 0 <= ix < W - 1:
            a[iy, ix] = max(a[iy, ix], mm)
            if mm > mags_max * 0.75:
                a[iy, ix + 1] = max(a[iy, ix + 1], mm * 0.35)
                a[iy + 1, ix] = max(a[iy + 1, ix], mm * 0.35)
    if cross:
        for _ in range(16):
            cx, cy = int(rng.random() * W), int(rng.random() * H)
            L = int(rng.integers(7, 18))
            for k in range(-L, L + 1):
                v = (1 - abs(k) / L) * 0.5
                if 0 <= cy < H and 0 <= cx + k < W: a[cy, cx + k] = max(a[cy, cx + k], v)
                if 0 <= cy + k < H and 0 <= cx < W: a[cy + k, cx] = max(a[cy + k, cx], v)
    return img + a[..., None] * np.array([1.0, 0.86, 0.90], np.float32) * 255

img = add_stars(img, 2600, 0.55)
img = add_stars(img, 800, 1.0, cross=True)

# 星点被黑洞吃掉
img *= (1 - hole[..., None] * 0.985)

# ---------- 天际线细塔 ----------
towers = Image.new('L', (W, H), 0)
d = ImageDraw.Draw(towers)
for tx, th, tw in [(0.118, 170, 4), (0.138, 104, 3), (0.176, 138, 4), (0.202, 72, 2),
                   (0.232, 190, 5), (0.268, 96, 3), (0.304, 64, 2)]:
    x = int(tx * W)
    yb = int(float(arc[0, max(0, min(W - 1, x))]) * H) + 10
    d.rectangle([x, yb - th, x + tw, yb], fill=255)
    d.line([x + tw // 2, yb - th, x + tw // 2, yb - th - 30], fill=150, width=1)
    if th > 120:
        d.ellipse([x - 4, yb - th - 10, x + tw + 4, yb - th + 2], outline=120, width=1)
tw = np.array(towers, np.float32) / 255
img *= (1 - tw[..., None] * 0.55)
img += (tw > 0.5)[..., None].astype(np.float32) * np.array([56, 16, 22], np.float32)

# ---------- 前景小行星 ----------
ast = Image.new('L', (W, H), 0)
rim_light = Image.new('L', (W, H), 0)
d = ImageDraw.Draw(ast)
dr = ImageDraw.Draw(rim_light)
rocks = [(0.085, 0.965, 190, 120), (0.005, 1.02, 150, 110), (0.885, 0.945, 240, 130),
         (0.975, 0.80, 110, 85), (0.60, 1.10, 200, 95), (0.33, 1.05, 120, 80)]
for cx, cy, rx, ry in rocks:
    pts = []
    n = 26
    for i in range(n):
        a_ = 2 * np.pi * i / n
        k = 0.70 + rng.random() * 0.45
        pts.append((cx * W + np.cos(a_) * rx * k, cy * H + np.sin(a_) * ry * k))
    d.polygon(pts, fill=255)
    dr.line(pts + [pts[0]], fill=200, width=2)
a = np.array(ast, np.float32) / 255
rimA = np.array(rim_light, np.float32) / 255
img *= (1 - a[..., None] * 0.95)
img += a[..., None] * np.array([14, 3, 6], np.float32)
img += rimA[..., None] * np.array([130, 36, 48], np.float32) * 0.6

vig = 1.0 - 0.62 * np.clip(np.sqrt(((nx - 0.52) / 0.66) ** 2 + ((ny - 0.48) / 0.66) ** 2), 0, 1) ** 2.0
img *= np.clip(vig, 0.20, 1.0)[..., None]
img += rng.standard_normal((H, W)).astype(np.float32)[..., None] * 2.8

out = np.clip(img, 0, 255).astype(np.uint8)
Image.fromarray(out).save(str(Path(__file__).resolve().parent.parent / 'assets' / 'scene.jpg'), quality=90, optimize=True)
print("ok")

