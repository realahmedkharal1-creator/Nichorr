import os, glob

files = glob.glob("src/app/**/*.tsx", recursive=True)
print(f"Total tsx files: {len(files)}")
