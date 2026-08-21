import os
import re

file_path = r"src\app\content\[id]\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove MOCK_DATA array block
content = re.sub(r'const MOCK_DATA = \[.*?\];', '', content, flags=re.DOTALL)

# Replace the fallback logic
content = content.replace(
'''      } else {
        // Fallback
        const found = MOCK_DATA.find(m => m.id === params.id) || MOCK_DATA[0];
        setItem(found);
      }
    } catch (e) {
      console.error(e);
      const found = MOCK_DATA.find(m => m.id === params.id) || MOCK_DATA[0];
      setItem(found);
    } finally {''',
'''      } else {
        setItem(null);
      }
    } catch (e) {
      console.error(e);
      setItem(null);
    } finally {'''
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Removed MOCK_DATA from content/[id]/page.tsx")
