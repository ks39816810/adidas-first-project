#!/usr/bin/env python3
"""今日の曜日を表示するプログラム。"""

from __future__ import annotations

from datetime import date


JAPANESE_WEEKDAYS = ("月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日")


def get_today_weekday() -> str:
    """今日の曜日を日本語で返します。"""
    return JAPANESE_WEEKDAYS[date.today().weekday()]


def main() -> None:
    """今日の曜日を標準出力に表示します。"""
    print(f"今日は{get_today_weekday()}です。")


if __name__ == "__main__":
    main()
