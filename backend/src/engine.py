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
    # If the text is purely alphanumeric (non-Thai), return as is
    if txt.isalnum() and all(ord(c) < 128 for c in txt):
        return txt

    for ipa in process_ipa_text(txt):
        try:
            obj = ThaiIPA(ipa)
            result = generate_lu_first_syllable(obj) + generate_lu_last_syllable(obj)
            results.append(result)
        except Exception as e:
            print(f"Skipping invalid IPA '{ipa}': {e}")
            # If a specific part fails, we might just want to keep the original or skip
            # For now, let's keep the original part if possible, or just skip it
            continue
    
    return " ".join(results) if results else txt