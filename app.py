from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from lunar_python import Lunar, Solar
import math
from typing import Dict, List, Union, Optional, Any
from dataclasses import dataclass
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv
from pathlib import Path
from pydantic import ValidationError
from schemas import *

# 加载环境变量并打印检查信息
load_dotenv()
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables")
else:
    print("GEMINI_API_KEY found in environment")

# 配置 Gemini API
genai.configure(api_key=GEMINI_API_KEY)
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

app = Flask(__name__)
CORS(app)

# 天干
HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
# 地支
EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
# 十二长生
LIFE_STAGES = {
    "甲": ["沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝", "胎", "养", "长生"],
    "丙": ["胎", "养", "长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝"],
    "戊": ["胎", "养", "长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝"],
    "庚": ["死", "墓", "绝", "胎", "养", "长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病"],
    "壬": ["长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝", "胎", "养"],
    "乙": ["病", "死", "墓", "绝", "胎", "养", "长生", "沐浴", "冠带", "临官", "帝旺", "衰"],
    "丁": ["绝", "胎", "养", "长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓"],
    "己": ["绝", "胎", "养", "长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓"],
    "辛": ["衰", "病", "死", "墓", "绝", "胎", "养", "长生", "沐浴", "冠带", "临官", "帝旺"],
    "癸": ["帝旺", "衰", "病", "死", "墓", "绝", "胎", "养", "长生", "沐浴", "冠带", "临官"]
}

# 五行生克关系
FIVE_ELEMENTS_RELATIONS = {
    "木": {"木": "比劫", "火": "食神", "土": "偏财", "金": "七杀", "水": "正印"},
    "火": {"木": "正印", "火": "比劫", "土": "食神", "金": "偏财", "水": "七杀"},
    "土": {"木": "七杀", "火": "正印", "土": "比劫", "金": "食神", "水": "偏财"},
    "金": {"木": "偏财", "火": "七杀", "土": "正印", "金": "比劫", "水": "食神"},
    "水": {"木": "食神", "火": "偏财", "土": "七杀", "金": "正印", "水": "比劫"}
}

# 阴阳对应的十神
YIN_YANG_GODS = {
    "比劫": {"阳": "比肩", "阴": "劫财"},
    "食神": {"阳": "食神", "阴": "伤官"},
    "偏财": {"阳": "偏财", "阴": "正财"},
    "七杀": {"阳": "七杀", "阴": "正官"},
    "正印": {"阳": "偏印", "阴": "正印"}
}

# 添加新的数据类型定义
class ElementStrength(str, Enum):
    WEAK = "weak"
    AVERAGE = "average"
    STRONG = "strong"
    VERY_WEAK = "很弱"

@dataclass
class ElementScore:
    score: int
    strength: ElementStrength

@dataclass
class Pattern:
    name: str
    analysis: str
    influence: str

@dataclass
class TenGodInfluence:
    personality: str
    career: str
    wealth: str
    marriage: str
    family: str

@dataclass
class TenGod:
    name: str
    element: str
    strength: ElementStrength
    location: str
    analysis: str
    influence: TenGodInfluence

@dataclass
class HiddenRelationship:
    type: str
    branches: List[str]
    analysis: str

@dataclass
class Personality:
    traits: List[str]
    strengths: List[str]
    weaknesses: List[str]

@dataclass
class BaziAnalysis:
    fiveElements: Dict[str, ElementScore]
    pattern: Pattern
    tenGods: List[TenGod]
    hiddenRelationships: List[HiddenRelationship]
    favorableElements: List[str]
    unfavorableElements: List[str]
    personality: Personality
    health: Dict[str, List[str]]

# 添加新的数据类型定义
@dataclass
class PotentialEvents:
    career: str
    wealth: str
    relationship: str
    health: str
    social: str

@dataclass 
class KeyYear:
    year: int
    stem: str
    branch: str
    tenGodOfStem: str
    tenGodOfBranch: str
    overallAssessment: str
    potentialEvents: PotentialEvents
    risksAndSuggestions: str

@dataclass
class MajorLuckCycle:
    startAge: int
    endAge: int
    startYear: int
    endYear: int
    stem: str
    branch: str
    tenGodOfStem: str
    tenGodOfBranch: str
    overallAssessment: str
    tenGodInfluence: str
    interactionWithOriginalChart: str
    keyYears: List[KeyYear]

@dataclass
class LifeStageSummary:
    earlyYears: str
    middleAge: str
    laterYears: str

@dataclass
class LifeTrajectoryAnalysis:
    overallTrajectory: Dict[str, Any]
    majorLuckCycles: List[MajorLuckCycle]
    lifeStageSummary: LifeStageSummary


def get_year_stem_branch(solar_date):
    """计算年柱，以立春为界"""
    lunar = solar_date.getLunar()
    # 获取当前日期的节气信息
    jieqi = lunar.getJieQi()
    
    # 如果在立春前，年柱还要算前一年
    year = solar_date.getYear()
    if jieqi.startswith("立春") and lunar.getMonth() == 1:
        year -= 1
        
    stem_index = (year - 4) % 10
    branch_index = (year - 4) % 12
    
    return HEAVENLY_STEMS[stem_index], EARTHLY_BRANCHES[branch_index]

def get_month_stem_branch(year_stem, solar_date):
    """计算月柱，需要考虑节气"""
    lunar = solar_date.getLunar()
    # 使用月份的干支信息来推断节气月份
    month_ganzhi = lunar.getMonthInGanZhi()
    month_branch_index = EARTHLY_BRANCHES.index(month_ganzhi[1:])
    
    # 月干公式：年干 * 2 + 月支索引，超过10从头开始
    base_stem_index = HEAVENLY_STEMS.index(year_stem) * 2 % 10
    month_stem_index = (base_stem_index + month_branch_index) % 10
    
    return HEAVENLY_STEMS[month_stem_index], EARTHLY_BRANCHES[month_branch_index]

def get_day_stem_branch(solar_date):
    """计算日柱"""
    lunar = solar_date.getLunar()
    day_stem = lunar.getDayInGanZhi()[:1]  # 获取日干
    day_branch = lunar.getDayInGanZhi()[1:]  # 获取日支
    return day_stem, day_branch

def get_hour_stem_branch(day_stem, hour):
    """计算时柱"""
    # 时干根据日干推算
    day_stem_index = HEAVENLY_STEMS.index(day_stem)
    base_stem_index = (day_stem_index * 2) % 10
    
    # 子时（23:00-1:00）开始
    if hour == 23:
        hour = 0
    branch_index = (hour + 1) // 2 % 12
    stem_index = (base_stem_index + branch_index) % 10
    
    return HEAVENLY_STEMS[stem_index], EARTHLY_BRANCHES[branch_index]

def get_five_elements(stem, branch):
    """获取五行属性"""
    five_elements = {
        "甲": "木", "乙": "木",
        "丙": "火", "丁": "火",
        "戊": "土", "己": "土",
        "庚": "金", "辛": "金",
        "壬": "水", "癸": "水",
        "子": "水", "亥": "水",
        "寅": "木", "卯": "木",
        "巳": "火", "午": "火",
        "辰": "土", "戌": "土", "丑": "土", "未": "土",
        "申": "金", "酉": "金"
    }
    
    # 修改返回逻辑，处理空值情况
    stem_element = five_elements.get(stem, "")
    branch_element = five_elements.get(branch, "") if branch else ""
    
    return stem_element, branch_element

def get_life_stage(day_stem, branch):
    """获取十二长生"""
    if day_stem in LIFE_STAGES:
        branch_index = EARTHLY_BRANCHES.index(branch)
        return LIFE_STAGES[day_stem][branch_index]
    return ""

def get_stem_god(day_stem: str, target_stem: str) -> str:
    """计算天干十神"""
    day_element = get_five_elements(day_stem, "")[0]
    target_element = get_five_elements(target_stem, "")[0]
    
    # 添加空值检查
    if not day_element or not target_element:
        return ""
    
    # 获取基础十神
    base_god = FIVE_ELEMENTS_RELATIONS[day_element][target_element]
    
    # 判断阴阳
    is_day_yang = HEAVENLY_STEMS.index(day_stem) % 2 == 0
    is_target_yang = HEAVENLY_STEMS.index(target_stem) % 2 == 0
    
    # 确定具体十神
    if base_god in YIN_YANG_GODS:
        return YIN_YANG_GODS[base_god]["阳" if is_target_yang else "阴"]
    return base_god

def get_branch_hidden_stems(branch: str) -> list:
    """获取地支藏干"""
    hidden_stems = {
        "子": ["癸"],
        "丑": ["己", "癸", "辛"],
        "寅": ["甲", "丙", "戊"],
        "卯": ["乙"],
        "辰": ["戊", "乙", "癸"],
        "巳": ["丙", "戊", "庚"],
        "午": ["丁", "己"],
        "未": ["己", "丁", "乙"],
        "申": ["庚", "壬", "戊"],
        "酉": ["辛"],
        "戌": ["戊", "辛", "丁"],
        "亥": ["壬", "甲"]
    }
    return hidden_stems.get(branch, [])

def get_branch_gods(day_stem: str, branch: str) -> List[List[str]]:
    """计算地支藏干的十神"""
    hidden_stems = get_branch_hidden_stems(branch)
    # 修改返回格式为二维数组
    return [[stem, get_stem_god(day_stem, stem)] for stem in hidden_stems]

def calculate_decade_fate(gender: str, day_stem: str, month_stem: str, month_branch: str, birth_date: datetime) -> dict:
    """计算大运"""
    solar = Solar.fromDate(birth_date)
    lunar = solar.getLunar()
    
    # 获取年干判断阴阳年
    year_stem = lunar.getYearInGanZhi()[0]
    is_year_yang = HEAVENLY_STEMS.index(year_stem) % 2 == 0  # 甲丙戊庚壬为阳
    
    # 判断大运顺逆
    # 阳年男命、阴年女命顺排；阴年男命、阳年女命逆排
    is_gender_yang = (gender == 'male')
    is_forward = (is_year_yang and is_gender_yang) or (not is_year_yang and not is_gender_yang)
    
    # 获取节气表
    jieqi_table = lunar.getJieQiTable()
    
    # 找到相关的节（不是气）
    birth_time = datetime(birth_date.year, birth_date.month, birth_date.day, 
                         birth_date.hour, birth_date.minute)
    target_jieqi = None
    
    # 定义节气名称列表（按顺序）
    JIEQI_NAMES = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒']
    
    # 将节气表转换为有序列表，只保留节（不要气）
    jieqi_list = []
    for jieqi_name, jieqi_date in jieqi_table.items():
        if isinstance(jieqi_date, Solar):
            if jieqi_name in JIEQI_NAMES:
                # 获取节气的具体时间（包括时分）
                jieqi_datetime = datetime(jieqi_date.getYear(), jieqi_date.getMonth(), 
                                       jieqi_date.getDay(), jieqi_date.getHour(), 
                                       jieqi_date.getMinute())
                jieqi_list.append((jieqi_name, jieqi_datetime))
    
    # 按日期排序
    jieqi_list.sort(key=lambda x: x[1])
    
    # 找到相邻的节气
    for i, (jieqi_name, jieqi_time) in enumerate(jieqi_list):
        if is_forward:  # 阳年男命或阴年女命找下一个节
            if jieqi_time > birth_time:
                target_jieqi = jieqi_time
                print(f'found next jieqi: {jieqi_name}, date: {jieqi_time}')
                break
        else:  # 阴年男命或阳年女命找上一个节
            if jieqi_time > birth_time and i > 0:
                target_jieqi = jieqi_list[i-1][1]
                print(f'found previous jieqi: {jieqi_list[i-1][0]}, date: {target_jieqi}')
                break
    
    if target_jieqi:
        # 计算日期差（精确到分钟）
        time_diff = target_jieqi - birth_time if is_forward else birth_time - target_jieqi
        total_days = time_diff.total_seconds() / (24 * 3600)  # 转换为天数（包含小数部分）
        
        # 每3天为1年，1天为4个月，1个时辰为10天
        starting_age = total_days / 3
        
        # 计算起运年份（不需要向上取整，直接使用实际年份）
        start_year = birth_date.year + int(starting_age)
    else:
        starting_age = 6.2  # 默认值
        start_year = birth_date.year + 6  # 默认起运年份
    
    # 从月柱开始排大运
    month_stem_idx = HEAVENLY_STEMS.index(month_stem)
    month_branch_idx = EARTHLY_BRANCHES.index(month_branch)
    
    decade_fate = []
    for i in range(8):
        if is_forward:
            # 顺排
            new_stem_idx = (month_stem_idx + i + 1) % 10
            new_branch_idx = (month_branch_idx + i + 1) % 12
        else:
            # 逆排
            new_stem_idx = (month_stem_idx - (i + 1)) % 10
            new_branch_idx = (month_branch_idx - (i + 1)) % 12
        
        # 获取天干地支
        new_stem = HEAVENLY_STEMS[new_stem_idx]
        new_branch = EARTHLY_BRANCHES[new_branch_idx]
        
        # 计算年龄范围（从起运年龄开始，向上取整）
        start_age = math.ceil(starting_age) + i * 10
        end_age = start_age + 9
        
        # 计算年份范围（从起运年份开始）
        period_start_year = start_year + (i * 10)
        period_end_year = period_start_year + 9
        
        # 计算十神关系
        stem_god = get_stem_god(day_stem, new_stem)
        branch_gods = get_branch_gods(day_stem, new_branch)
        
        fate = {
            "stem": new_stem,
            "stemGod": stem_god,
            "branch": new_branch,
            "branchGods": branch_gods,
            "elements": list(get_five_elements(new_stem, new_branch)),
            "startAge": start_age,
            "endAge": end_age,
            "startYear": period_start_year,
            "endYear": period_end_year
        }
        decade_fate.append(fate)
    
    return {
        "startingAge": round(starting_age, 1),
        "fates": decade_fate
    }

def calculate_years_fate(start_year: int, end_year: int, day_stem: str) -> list:
    """计算一段时间内的流年"""
    years_fate = []
    for year in range(start_year, end_year + 1):
        stem_idx = (year - 4) % 10
        branch_idx = (year - 4) % 12
        
        stem = HEAVENLY_STEMS[stem_idx]
        branch = EARTHLY_BRANCHES[branch_idx]
        
        # 计算十神关系
        stem_god = get_stem_god(day_stem, stem)
        branch_gods = get_branch_gods(day_stem, branch)
        
        fate = {
            "stem": stem,
            "stemGod": stem_god,
            "branch": branch,
            "branchGods": branch_gods,
            "elements": list(get_five_elements(stem, branch)),
            "year": year
        }
        years_fate.append(fate)
    
    return years_fate

def calculate_current_year_fate(birth_year: int, day_stem: str, current_year: int = None) -> dict:
    """计算当前流年"""
    if current_year is None:
        current_year = datetime.now().year
    
    stem_idx = (current_year - 4) % 10
    branch_idx = (current_year - 4) % 12
    
    stem = HEAVENLY_STEMS[stem_idx]
    branch = EARTHLY_BRANCHES[branch_idx]
    
    # 计算十神关系
    stem_god = get_stem_god(day_stem, stem)
    branch_gods = get_branch_gods(day_stem, branch)
    
    return {
        "stem": stem,
        "stemGod": stem_god,
        "branch": branch,
        "branchGods": branch_gods,
        "elements": list(get_five_elements(stem, branch)),
        "year": current_year
    }

def load_prompt(prompt_name: str, version: str = "v1") -> str:
    """
    从prompts目录加载指定版本的提示词
    
    Args:
        prompt_name: 提示词文件名（不含扩展名）
        version: 提示词版本，默认为"v1"
    
    Returns:
        str: 提示词内容
    """
    prompt_path = Path(__file__).parent / "prompts" / version / f"{prompt_name}.json"
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            prompt_data = json.load(f)
            return prompt_data["system_instruction"]
    except Exception as e:
        print(f"Error loading prompt {prompt_name}: {str(e)}")
        raise

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        print("\n=== Calculate Request ===")
        print("Request JSON:", request.json)
        
        # 验证请求数据
        request_data = CalculateRequest(**request.json)
        print("Validated request data:", request_data.dict())
        
        birth_date = request_data.birthDate
        gender = request_data.gender.value
        
        print("Birth date:", birth_date)
        print("Gender:", gender)
        
        # 转换为Solar对象
        solar = Solar.fromDate(birth_date)
        
        # 计算八字信息
        year_stem, year_branch = get_year_stem_branch(solar)
        month_stem, month_branch = get_month_stem_branch(year_stem, solar)
        day_stem, day_branch = get_day_stem_branch(solar)
        hour_stem, hour_branch = get_hour_stem_branch(day_stem, birth_date.hour)
        
        # 获取农历日期
        lunar = solar.getLunar()
        
        # 计算五行和长生十二宫
        year_elements = get_five_elements(year_stem, year_branch)
        month_elements = get_five_elements(month_stem, month_branch)
        day_elements = get_five_elements(day_stem, day_branch)
        hour_elements = get_five_elements(hour_stem, hour_branch)
        
        year_life_stage = get_life_stage(day_stem, year_branch)
        month_life_stage = get_life_stage(day_stem, month_branch)
        day_life_stage = get_life_stage(day_stem, day_branch)
        hour_life_stage = get_life_stage(day_stem, hour_branch)
        
        # 计算十神关系
        year_stem_god = get_stem_god(day_stem, year_stem)
        month_stem_god = get_stem_god(day_stem, month_stem)
        hour_stem_god = get_stem_god(day_stem, hour_stem)
        
        year_branch_gods = get_branch_gods(day_stem, year_branch)
        month_branch_gods = get_branch_gods(day_stem, month_branch)
        day_branch_gods = get_branch_gods(day_stem, day_branch)
        hour_branch_gods = get_branch_gods(day_stem, hour_branch)
        
        # 计算大运
        decade_fate = calculate_decade_fate(gender, day_stem, month_stem, month_branch, birth_date)
        
        # 计算流年
        current_year_fate = calculate_current_year_fate(solar.getYear(), day_stem)
        
        # 构建响应数据
        result = {
            "yearPillar": {
                "stem": year_stem,
                "stemGod": year_stem_god,
                "branch": year_branch,
                "branchGods": year_branch_gods,
                "elements": list(year_elements),
                "lifeStage": year_life_stage
            },
            "monthPillar": {
                "stem": month_stem,
                "stemGod": month_stem_god,
                "branch": month_branch,
                "branchGods": month_branch_gods,
                "elements": list(month_elements),
                "lifeStage": month_life_stage
            },
            "dayPillar": {
                "stem": day_stem,
                "stemGod": None,
                "branch": day_branch,
                "branchGods": day_branch_gods,
                "elements": list(day_elements),
                "lifeStage": day_life_stage
            },
            "hourPillar": {
                "stem": hour_stem,
                "stemGod": hour_stem_god,
                "branch": hour_branch,
                "branchGods": hour_branch_gods,
                "elements": list(hour_elements),
                "lifeStage": hour_life_stage
            },
            "gender": gender,
            "lunarDate": {
                "year": lunar.getYear(),
                "month": lunar.getMonth(),
                "day": lunar.getDay(),
                "yearInGanZhi": lunar.getYearInGanZhi(),
                "monthInGanZhi": lunar.getMonthInGanZhi(),
                "dayInGanZhi": lunar.getDayInGanZhi()
            },
            "decadeFate": decade_fate,
            "currentYearFate": current_year_fate
        }
        
        # 在返回响应前打印结果
        print("\nResult data:", result)
        
        # 验证响应数据
        response_data = CalculateResponse(**result)
        print("Validated response data:", response_data.dict())
        
        return jsonify(response_data.dict())
        
    except ValidationError as e:
        print("\nValidation Error:")
        print(str(e))
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print("\nUnexpected Error:")
        print(str(e))
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/calculate_years', methods=['POST'])
def calculate_years():
    try:
        # 验证请求数据
        request_data = CalculateYearsRequest(**request.json)
        
        # 计算流年
        years_fate = calculate_years_fate(
            request_data.startYear,
            request_data.endYear,
            request_data.dayStem
        )
        
        # 验证响应数据
        response_data = [FateInfo(**fate) for fate in years_fate]
        return jsonify([fate.dict() for fate in response_data])
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-bazi', methods=['POST'])
def analyze_bazi():
    try:
        print("\n=== Analyze Bazi Request ===")
        print("Request JSON:", request.json)
        
        # 验证请求数据
        request_data = AnalyzeBaziRequest(**request.json)
        print("Validated request data:", request_data.dict())
        
        # 构建提示词
        input_data = {
            "year": request_data.year,
            "month": request_data.month,
            "day": request_data.day,
            "hour": request_data.hour,
            "gender": request_data.gender.value,
            "bazi": request_data.bazi.dict()
        }
        
        print("\nFormatted input data:", json.dumps(input_data, ensure_ascii=False))
        
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash-thinking-exp-1219",
            generation_config=generation_config,
            system_instruction=load_prompt("bazi_analysis")
        )
        chat_session = model.start_chat(history=[])
        
        # 调用 Gemini API
        response = chat_session.send_message(json.dumps(input_data, ensure_ascii=False))
        print("\nGemini API Response:", response.text)
        
        # 从响应中提取 JSON 字符串
        response_text = response.text
        json_start = response_text.find('```json') + 7
        json_end = response_text.find('```', json_start)
        if json_start == -1 or json_end == -1:
            raise ValueError("Invalid response format from Gemini API")
            
        json_str = response_text[json_start:json_end].strip()
        print("\nExtracted JSON string:", json_str)
        
        # 解析 JSON 数据并验证
        try:
            analysis_result = json.loads(json_str)
            print("\nParsed JSON:", analysis_result)
            
            # 确保所有必需字段都存在
            required_fields = {
                'fiveElements': {'wood', 'fire', 'earth', 'metal', 'water'},
                'pattern': {'name', 'analysis', 'influence'},
                'tenGods': [],
                'hiddenRelationships': [],
                'favorableElements': [],
                'unfavorableElements': [],
                'personality': {'traits', 'strengths', 'weaknesses'},
                'health': {'risks'}
            }
            
            # 检查并补充缺失字段
            for field, subfields in required_fields.items():
                if field not in analysis_result:
                    if isinstance(subfields, set):
                        analysis_result[field] = {k: {'score': 0, 'strength': 'average'} 
                                                if k in {'wood', 'fire', 'earth', 'metal', 'water'}
                                                else {'name': '', 'analysis': '', 'influence': ''}
                                                for k in subfields}
                    else:
                        analysis_result[field] = []
            
            response_data = BaziAnalysisResult(**analysis_result)
            print("\nValidated response data:", response_data.dict())
            
            return jsonify(response_data.dict())
            
        except json.JSONDecodeError as e:
            print("\nJSON Decode Error:", str(e))
            raise ValueError(f"Invalid JSON in response: {str(e)}")
            
    except ValidationError as e:
        print("\nValidation Error:")
        print(str(e))
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print("\nUnexpected Error:")
        print(str(e))
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/bazi/life-trajectory-analysis', methods=['POST'])
def analyze_life_trajectory():
    try:
        # 验证请求数据
        request_data = LifeTrajectoryRequest(**request.json)
        
        # 调用 Gemini API
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash-thinking-exp-1219",
            generation_config=generation_config,
            system_instruction=load_prompt("life_trajectory")
        )
        chat_session = model.start_chat(history=[])
        
        # 发送请求
        response = chat_session.send_message(f"请开始分析以下八字、大运和流年：\n\n{request_data.json()}")
        
        # 从响应中提取 JSON 字符串
        response_text = response.text
        json_start = response_text.find('```json') + 7
        json_end = response_text.find('```', json_start)
        json_str = response_text[json_start:json_end].strip()
        
        # 解析 JSON 数据并验证
        analysis_result = json.loads(json_str)
        response_data = LifeTrajectoryResult(**analysis_result)
        
        return jsonify(response_data.dict())
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5002, debug=True)
