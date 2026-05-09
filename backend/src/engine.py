# -*- coding: utf-8 -*-
from tltk import th2ipa
import copy

# ดึงมาจากโฟลเดอร์ ipa_transcriber ที่วางอยู่คู่กัน
from ipa_transcriber import ThaiIPA
# แก้ไขจุดนี้เพื่อให้เรียกใช้โฟลเดอร์ ipa_transcriber ที่วางอยู่คู่กันได้เลย
def process_ipa_text(txt: str) -> list[str]:
    try:
        ipas = th2ipa(txt)
        replace_str = {' <s/>': ' ', '.': ' ', '-': ''}
        for key ,value in replace_str.items():     
            ipas = ipas.replace(key, value)
        ipas = ipas.strip()    
        return [ipa for ipa in ipas.split(' ') if ipa.strip()]
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return []

def generate_lu_first_syllable(obj: ThaiIPA) -> str:
    o = copy.deepcopy(obj)
    if o.initial_en in ['l','r']:
        o.initial_en = 's'
    else:
        o.initial_en = 'l'
    o.cluster_en = ''
    return o.spell()

def generate_lu_last_syllable(obj: ThaiIPA) -> str:
    o = copy.deepcopy(obj)
    if o.vowel_en in ['u','uː']:
        o.vowel_en = 'iː' if o.is_long else 'i'
    else:
        o.vowel_en = 'uː' if o.is_long else 'u'
    return o.spell() 

def convert_to_lu(txt: str) -> str:
    results = []
    for ipa in process_ipa_text(txt):
        obj = ThaiIPA(ipa)
        result = generate_lu_first_syllable(obj) + generate_lu_last_syllable(obj)
        results.append(result)
    return " ".join(results)