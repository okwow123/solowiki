#!/usr/bin/env python3
"""
각 시즌의 통합 하이라이트 영상 + 인기 출연자 개별 영상을 raw-9-17.json에 추가
"""
import json
from pathlib import Path

JSON_PATH = Path("/Users/kimminje/workspace/solo/data/raw-9-17.json")

# 시즌별 통합 영상 (모든 출연자에게 기본 매핑)
SEASON_DEFAULT = {
    9: {
        "youtube_id": "3EAzq3yUWho",
        "title": "나는 SOLO 9기 최종 선택의 순간",
        "description": "9기 출연자들의 최종 선택 장면",
        "duration_sec": None,
        "source_channel": "SBS Plus / ENA",
        "sort_order": 0,
    },
    10: {
        "youtube_id": "9xW9c_a6-rg",
        "title": "10기, 16기, 22기 돌싱들의 자기소개 모음집",
        "description": "10기 출연자 자기소개 하이라이트",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    11: {
        "youtube_id": "MDusvDHtluw",
        "title": "나는솔로 11기 1화~3화 하이라이트 모아보기",
        "description": "11기 출연자 소개, 첫인상, 자기소개",
        "duration_sec": None,
        "source_channel": "SBS PLUS",
        "sort_order": 0,
    },
    12: {
        "youtube_id": "bAOvkDlt-Cc",
        "title": "12간지 솔로들의 모태솔로가 된 이유 모음zip",
        "description": "12기 모태솔로 출연자 소개 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    13: {
        "youtube_id": "RPB2qXfpt-c",
        "title": "나는 솔로 13기 요약 몰아보기",
        "description": "13기 전체 요약 하이라이트",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    14: {
        "youtube_id": "MdDw6nnwbtg",
        "title": "골드 미스&미스터 특집 14기 1~4화 25분 벼락치기",
        "description": "14기 출연자 소개, 첫인상, 자기소개",
        "duration_sec": None,
        "source_channel": "SBS PLUS",
        "sort_order": 0,
    },
    15: {
        "youtube_id": "FqJu8hrbhs8",
        "title": "30분으로 몰아보는 솔로 나라 15번지의 이야기",
        "description": "15기 전체 요약",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    16: {
        "youtube_id": "d2DyU0Or4n0",
        "title": "16기 돌싱들의 첫 등장 모음zip",
        "description": "16기 출연자 첫 등장 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    17: {
        "youtube_id": "quRxcivKirw",
        "title": "17기 솔로남들의 자기소개",
        "description": "17기 남자 출연자 자기소개",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
}

# 인기 출연자 개별 영상 (기본 통합 영상을 덮어씀)
# key: (season, gamyeong)
OVERRIDES = {
    # 9기 - 결혼 커플 광수-영숙, 인기 출연자
    (9, "광수"): {
        "youtube_id": "QenqtFJoUNg",
        "title": "치명적인 매력! 마성의 광수들 모음zip",
        "description": "나솔 역대 광수 출연자 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    (9, "영숙"): {
        "youtube_id": "q1lsF7m95A4",
        "title": "나는솔로 9기 광수 영숙 결혼 근황",
        "description": "9기 결혼 커플 광수-영숙 신혼 근황",
        "duration_sec": None,
        "source_channel": "ENA / SBS Plus",
        "sort_order": 0,
    },
    (9, "옥순"): {
        "youtube_id": "csS4-5WMAas",
        "title": "9기 옥순 최종 커플까지 모음ZIP",
        "description": "9기 옥순 활약 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    (9, "영식"): {
        "youtube_id": "-yTaITHHoEM",
        "title": "강인한 매력의 9기 영식 활약 몰아보기",
        "description": "9기 영식 활약 모음 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    (9, "현숙"): {
        "youtube_id": "rBwrtXAURms",
        "title": "강아지 러버 9기 현숙 활약 몰아보기",
        "description": "9기 현숙 활약 모음 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    # 10기 - 인기 출연자
    (10, "영철"): {
        "youtube_id": "pkHnq7AxXZ8",
        "title": "순진남 영철과 Ms.불도저 현숙",
        "description": "10기 영철-현숙 러브라인",
        "duration_sec": None,
        "source_channel": "ENA PLAY",
        "sort_order": 0,
    },
    (10, "현숙"): {
        "youtube_id": "pkHnq7AxXZ8",
        "title": "순진남 영철과 Ms.불도저 현숙",
        "description": "10기 영철-현숙 러브라인",
        "duration_sec": None,
        "source_channel": "ENA PLAY",
        "sort_order": 0,
    },
    (10, "정숙"): {
        "youtube_id": "STOtBJvXe10",
        "title": "올타임 레전드 10기 정숙의 고품격 토크",
        "description": "10기 정숙 토크 모음 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    (10, "영식"): {
        "youtube_id": "W2NeiPQDvr0",
        "title": "짝꿩 찾으러 나선 10기 영식",
        "description": "10기 영식 러브라인 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    # 11기 - 인기 출연자
    (11, "옥순"): {
        "youtube_id": "QKydEKBMT9A",
        "title": "귀여운 허당 매력 11기 옥순 모음ZIP",
        "description": "11기 옥순 활약 모음 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    (11, "영철"): {
        "youtube_id": "OeGhfKvxE8E",
        "title": "최강 비주얼 11기 영철 활약 몰아보기",
        "description": "11기 영철 활약 모음 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    # 12기 - 인기 출연자
    (12, "광수"): {
        "youtube_id": "AJZ_kg1U6QQ",
        "title": "소리 없이 강한 12기 광수 활약집",
        "description": "12기 광수 활약 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    (12, "영식"): {
        "youtube_id": "TLf4i-YA7OQ",
        "title": "순진무구 귀여운 모태 솔로 12기 영식",
        "description": "12기 영식 활약 모음 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    (12, "영철"): {
        "youtube_id": "K94l-W_yMA0",
        "title": "엉뚱한 12기 영철 활약 몰아보기",
        "description": "12기 영철 활약 모음 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    # 13기 - 인기 출연자
    (13, "광수"): {
        "youtube_id": "c4UeLgq9QeI",
        "title": "날것 그대로의 매력 13기 광수 활약",
        "description": "13기 광수 활약 모음 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    (13, "옥순"): {
        "youtube_id": "_V4CIQJ6mGk",
        "title": "발랄한 매력의 13기 옥순 활약",
        "description": "13기 옥순 활약 모음 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    (13, "현숙"): {
        "youtube_id": "7woQrIlz9Ns",
        "title": "플러팅의 귀재 13기 현숙 활약",
        "description": "13기 현숙 활약 모음 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    # 14기 - 인기 출연자
    (14, "영숙"): {
        "youtube_id": "m0U4sARE9z0",
        "title": "0표에서 인기녀로 14기 영숙 모음zip",
        "description": "14기 영숙 활약 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    (14, "광수"): {
        "youtube_id": "Y8iBydXH15A",
        "title": "자기 객관화와 분석력 14기 광수 모음집",
        "description": "14기 광수 활약 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    (14, "옥순"): {
        "youtube_id": "yt9AKkjzUnQ",
        "title": "첫인상 1등 14기 인기녀 옥순 모먼트",
        "description": "14기 옥순 활약 모음",
        "duration_sec": None,
        "source_channel": "SBS PLUS",
        "sort_order": 0,
    },
    (14, "상철"): {
        "youtube_id": "SGWtrQ4K1cs",
        "title": "지금은 상철 시대 14기 상철 모음집",
        "description": "14기 상철 활약 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    # 15기 - 결혼 커플 광수-옥순
    (15, "광수"): {
        "youtube_id": "aFT0cPTb2CI",
        "title": "질풍노도 15기 광수 모음집",
        "description": "15기 광수 활약 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    (15, "옥순"): {
        "youtube_id": "K-TQEQGe4Ts",
        "title": "15기 커플 광수♥옥순 알콩달콩 모음",
        "description": "15기 결혼 커플 광수-옥순 (나솔사계)",
        "duration_sec": None,
        "source_channel": "ENA 채널 (나솔사계)",
        "sort_order": 0,
    },
    (15, "영철"): {
        "youtube_id": "E8FEO3eq6KU",
        "title": "진격의 직진남 15기 영철 모음집",
        "description": "15기 영철 활약 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    # 16기 - 인기 출연자
    (16, "상철"): {
        "youtube_id": "ThTqg_MK2Rg",
        "title": "16기 상철♥영숙 설렘 모먼트 모음zip",
        "description": "16기 상철-영숙 러브라인",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    (16, "영숙"): {
        "youtube_id": "49f0pSSs0rE",
        "title": "또 나만 진심이었지 16기 영숙 모음zip",
        "description": "16기 영숙 활약 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    # 17기 - 결혼 커플 상철-현숙
    (17, "영수"): {
        "youtube_id": "GiYj-_SBEPU",
        "title": "이창호 닮은 꼴 17기 영수 모음zip",
        "description": "17기 영수 활약 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    (17, "영철"): {
        "youtube_id": "irUfs_GTXqU",
        "title": "분석력 甲 17기 영철 모음zip",
        "description": "17기 영철 활약 모음",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    (17, "상철"): {
        "youtube_id": "Zuea5FFE4mw",
        "title": "17기 상철, 현숙 사랑하는데 왜 제 잇몸이 마르죠",
        "description": "17기 결혼 커플 상철-현숙",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
    (17, "현숙"): {
        "youtube_id": "Zuea5FFE4mw",
        "title": "17기 상철, 현숙 사랑하는데 왜 제 잇몸이 마르죠",
        "description": "17기 결혼 커플 상철-현숙",
        "duration_sec": None,
        "source_channel": "ENA 채널",
        "sort_order": 0,
    },
}


def main():
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))

    filled = 0
    empty = 0
    override_count = 0
    default_count = 0

    for season in data["seasons"]:
        sn = season["season_number"]
        default_video = SEASON_DEFAULT.get(sn)
        if not default_video:
            continue

        for contestant in season["contestants"]:
            gamyeong = contestant["gamyeong"]
            key = (sn, gamyeong)
            if key in OVERRIDES:
                contestant["highlights"] = [OVERRIDES[key]]
                override_count += 1
                filled += 1
            else:
                contestant["highlights"] = [default_video]
                default_count += 1
                filled += 1

    JSON_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print(f"✅ 업데이트 완료")
    print(f"   - 처리한 출연자: {len([c for s in data['seasons'] for c in s['contestants']])}명")
    print(f"   - highlights 1개 이상 채운 사람: {filled}명")
    print(f"   - highlights 빈 배열로 둔 사람: {empty}명")
    print(f"   - 기본 통합 영상 사용: {default_count}명")
    print(f"   - 개별 영상 오버라이드: {override_count}명")


if __name__ == "__main__":
    main()
