import sys
import json
import io
import engine 
sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def main():
    while True:
        line = sys.stdin.readline()
        if not line:
            break
        try:
            data = json.loads(line)
            text = data.get("text", "")
            text.replace(" ", "")
            lu_text = engine.convert_to_lu(text)
            print(json.dumps({"success": True, "result": lu_text}, ensure_ascii=False))
        except Exception as e:
            print(json.dumps({"success": False, "error": str(e)}, ensure_ascii=False))
        sys.stdout.flush()
if __name__ == "__main__":
    main()