#!/usr/bin/env python3
"""HTML全ページに生成画像を差し込む一括処理"""
from pathlib import Path

ROOT = Path('/Users/t.y/Desktop/建築クン')

def bg(name):
    return f"background-image:url('assets/images/{name}.jpg');"

def edit(file, replacements):
    p = ROOT / file
    s = p.read_text()
    miss = 0
    for old, new in replacements:
        if old not in s:
            print(f"  ✗ not found: {old[:90]!r}")
            miss += 1
            continue
        s = s.replace(old, new, 1)
    p.write_text(s)
    print(f"✓ {file}  ({len(replacements)-miss}/{len(replacements)} applied)")

# 共通：photos.css を全ページに追加
PHOTOS_LINK_OLD = '<link rel="stylesheet" href="css/style.css">'
PHOTOS_LINK_NEW = '<link rel="stylesheet" href="css/style.css">\n<link rel="stylesheet" href="css/photos.css">'

# ============ index.html ============
edit('index.html', [
    (PHOTOS_LINK_OLD, PHOTOS_LINK_NEW),
    ('<div class="hero__bg hero__bg--placeholder"></div>',
     f'<div class="hero__bg" style="{bg("hero-main")}"></div>'),
    ('<div class="about-grid__visual fade-up">',
     f'<div class="about-grid__visual fade-up" style="{bg("about-visual")}">'),
    # service cards 1〜3
    ('<div class="service-card__num">01</div>',
     f'<div class="service-card__photo" style="{bg("service-card-1")}"></div>\n          <div class="service-card__num">01</div>'),
    ('<div class="service-card__num">02</div>',
     f'<div class="service-card__photo" style="{bg("service-card-2")}"></div>\n          <div class="service-card__num">02</div>'),
    ('<div class="service-card__num">03</div>',
     f'<div class="service-card__photo" style="{bg("service-card-3")}"></div>\n          <div class="service-card__num">03</div>'),
])

# ============ about.html ============
edit('about.html', [
    (PHOTOS_LINK_OLD, PHOTOS_LINK_NEW),
    ('<div class="page-hero__bg"></div>',
     f'<div class="page-hero__bg" style="{bg("page-hero-about")}"></div>'),
    ('<div class="president__visual fade-up">',
     f'<div class="president__visual fade-up" style="{bg("president-portrait")}">'),
    # 沿革セクション背景画像
    ('<section class="section section--alt" id="history">',
     f'<section class="section section--alt section--history-bg" id="history" style="--history-bg:url(\'assets/images/history-bg.jpg\');">'),
])

# ============ services.html ============
edit('services.html', [
    (PHOTOS_LINK_OLD, PHOTOS_LINK_NEW),
    ('<div class="page-hero__bg"></div>',
     f'<div class="page-hero__bg" style="{bg("page-hero-services")}"></div>'),
    # 3 service-detail visuals - match by visual-num content
    ('<div class="service-detail__visual fade-up">\n          <div class="service-detail__visual-num">01</div>',
     f'<div class="service-detail__visual fade-up" style="{bg("service-detail-1")}">\n          <div class="service-detail__visual-num">01</div>'),
    ('<div class="service-detail__visual fade-up">\n          <div class="service-detail__visual-num">02</div>',
     f'<div class="service-detail__visual fade-up" style="{bg("service-detail-2")}">\n          <div class="service-detail__visual-num">02</div>'),
    ('<div class="service-detail__visual fade-up">\n          <div class="service-detail__visual-num">03</div>',
     f'<div class="service-detail__visual fade-up" style="{bg("service-detail-3")}">\n          <div class="service-detail__visual-num">03</div>'),
    # FLEET/WAREHOUSE/SYSTEM cards
    ('<div class="service-card__num">FLEET</div>',
     f'<div class="service-card__photo" style="{bg("fleet-card")}"></div>\n          <div class="service-card__num">FLEET</div>'),
    ('<div class="service-card__num">WAREHOUSE</div>',
     f'<div class="service-card__photo" style="{bg("warehouse-card")}"></div>\n          <div class="service-card__num">WAREHOUSE</div>'),
    ('<div class="service-card__num">SYSTEM</div>',
     f'<div class="service-card__photo" style="{bg("system-card")}"></div>\n          <div class="service-card__num">SYSTEM</div>'),
])

# ============ recruit.html ============
edit('recruit.html', [
    (PHOTOS_LINK_OLD, PHOTOS_LINK_NEW),
    ('<div class="page-hero__bg"></div>',
     f'<div class="page-hero__bg" style="{bg("page-hero-recruit")}"></div>'),
    # 4 position panels - unique匹配は data-tab親 + 子の visual-label
    ('<div class="position-panel__visual">\n              <svg class="position-panel__visual-icon" viewBox="0 0 100 80" fill="none">\n                <path d="M5 60 L5 20',
     f'<div class="position-panel__visual" style="{bg("position-driver")}">\n              <svg class="position-panel__visual-icon" viewBox="0 0 100 80" fill="none">\n                <path d="M5 60 L5 20'),
    ('<div class="position-panel__visual">\n              <svg class="position-panel__visual-icon" viewBox="0 0 100 80" fill="none">\n                <path d="M5 30',
     f'<div class="position-panel__visual" style="{bg("position-warehouse")}">\n              <svg class="position-panel__visual-icon" viewBox="0 0 100 80" fill="none">\n                <path d="M5 30'),
    ('<div class="position-panel__visual">\n              <svg class="position-panel__visual-icon" viewBox="0 0 100 80" fill="none">\n                <rect x="10"',
     f'<div class="position-panel__visual" style="{bg("position-office")}">\n              <svg class="position-panel__visual-icon" viewBox="0 0 100 80" fill="none">\n                <rect x="10"'),
    ('<div class="position-panel__visual">\n              <svg class="position-panel__visual-icon" viewBox="0 0 100 80" fill="none">\n                <circle cx="50"',
     f'<div class="position-panel__visual" style="{bg("position-management")}">\n              <svg class="position-panel__visual-icon" viewBox="0 0 100 80" fill="none">\n                <circle cx="50"'),
    # 3 voice cards - unique by role text
    ('<div class="voice-card__visual">\n            <svg class="voice-card__visual-icon" viewBox="0 0 100 100" fill="none">\n              <circle cx="50" cy="38" r="20" stroke="currentColor" stroke-width="2"/>\n              <path d="M20 100 C20 75 35 65 50 65 C65 65 80 75 80 100" stroke="currentColor" stroke-width="2"/>\n            </svg>\n            <div class="voice-card__meta">\n              <div class="voice-card__role">DRIVER / 入社3年</div>',
     f'<div class="voice-card__visual" style="{bg("voice-1-sato")}">\n            <svg class="voice-card__visual-icon" viewBox="0 0 100 100" fill="none">\n              <circle cx="50" cy="38" r="20" stroke="currentColor" stroke-width="2"/>\n              <path d="M20 100 C20 75 35 65 50 65 C65 65 80 75 80 100" stroke="currentColor" stroke-width="2"/>\n            </svg>\n            <div class="voice-card__meta">\n              <div class="voice-card__role">DRIVER / 入社3年</div>'),
    ('<div class="voice-card__visual">\n            <svg class="voice-card__visual-icon" viewBox="0 0 100 100" fill="none">\n              <circle cx="50" cy="38" r="20" stroke="currentColor" stroke-width="2"/>\n              <path d="M20 100 C20 75 35 65 50 65 C65 65 80 75 80 100" stroke="currentColor" stroke-width="2"/>\n            </svg>\n            <div class="voice-card__meta">\n              <div class="voice-card__role">OFFICE / 入社8年</div>',
     f'<div class="voice-card__visual" style="{bg("voice-2-suzuki")}">\n            <svg class="voice-card__visual-icon" viewBox="0 0 100 100" fill="none">\n              <circle cx="50" cy="38" r="20" stroke="currentColor" stroke-width="2"/>\n              <path d="M20 100 C20 75 35 65 50 65 C65 65 80 75 80 100" stroke="currentColor" stroke-width="2"/>\n            </svg>\n            <div class="voice-card__meta">\n              <div class="voice-card__role">OFFICE / 入社8年</div>'),
    ('<div class="voice-card__visual">\n            <svg class="voice-card__visual-icon" viewBox="0 0 100 100" fill="none">\n              <circle cx="50" cy="38" r="20" stroke="currentColor" stroke-width="2"/>\n              <path d="M20 100 C20 75 35 65 50 65 C65 65 80 75 80 100" stroke="currentColor" stroke-width="2"/>\n            </svg>\n            <div class="voice-card__meta">\n              <div class="voice-card__role">MANAGER / 入社22年</div>',
     f'<div class="voice-card__visual" style="{bg("voice-3-takahashi")}">\n            <svg class="voice-card__visual-icon" viewBox="0 0 100 100" fill="none">\n              <circle cx="50" cy="38" r="20" stroke="currentColor" stroke-width="2"/>\n              <path d="M20 100 C20 75 35 65 50 65 C65 65 80 75 80 100" stroke="currentColor" stroke-width="2"/>\n            </svg>\n            <div class="voice-card__meta">\n              <div class="voice-card__role">MANAGER / 入社22年</div>'),
    # 1日の流れ：track にクラス追加 + 6ステップに photo div
    ('<div class="day-flow__track">',
     '<div class="day-flow__track has-photos">'),
    ('<div class="day-flow__step">\n            <span class="day-flow__time">06:30</span>',
     f'<div class="day-flow__step has-photo">\n            <div class="day-flow__photo" style="{bg("day-1-roll-call")}"></div>\n            <span class="day-flow__time">06:30</span>'),
    ('<div class="day-flow__step">\n            <span class="day-flow__time">07:00</span>',
     f'<div class="day-flow__step has-photo">\n            <div class="day-flow__photo" style="{bg("day-2-inspection")}"></div>\n            <span class="day-flow__time">07:00</span>'),
    ('<div class="day-flow__step">\n            <span class="day-flow__time">07:30</span>',
     f'<div class="day-flow__step has-photo">\n            <div class="day-flow__photo" style="{bg("day-3-departure")}"></div>\n            <span class="day-flow__time">07:30</span>'),
    ('<div class="day-flow__step">\n            <span class="day-flow__time">12:00</span>',
     f'<div class="day-flow__step has-photo">\n            <div class="day-flow__photo" style="{bg("day-4-lunch")}"></div>\n            <span class="day-flow__time">12:00</span>'),
    ('<div class="day-flow__step">\n            <span class="day-flow__time">15:30</span>',
     f'<div class="day-flow__step has-photo">\n            <div class="day-flow__photo" style="{bg("day-5-afternoon")}"></div>\n            <span class="day-flow__time">15:30</span>'),
    ('<div class="day-flow__step">\n            <span class="day-flow__time">17:00</span>',
     f'<div class="day-flow__step has-photo">\n            <div class="day-flow__photo" style="{bg("day-6-end")}"></div>\n            <span class="day-flow__time">17:00</span>'),
])

# ============ contact.html ============
edit('contact.html', [
    (PHOTOS_LINK_OLD, PHOTOS_LINK_NEW),
    ('<div class="page-hero__bg"></div>',
     f'<div class="page-hero__bg" style="{bg("page-hero-contact")}"></div>'),
    # 地図はAI生成のイラスト風画像を背景に
    ('<div class="map-placeholder">',
     f'<div class="map-placeholder" style="{bg("map-aerial")}">'),
])

print("\n========================================\n全HTML編集完了")
