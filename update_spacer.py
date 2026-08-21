import os

file_path = r"src\components\research\ResearchTabNav.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Change px-6 to pl-6
content = content.replace(
    'className="flex overflow-x-auto gap-2 pb-3 px-6 w-full cursor-grab active:cursor-grabbing"',
    'className="flex overflow-x-auto gap-2 pb-3 pl-6 pr-0 w-full cursor-grab active:cursor-grabbing"'
)

# Add spacer div after the tabs mapping
content = content.replace(
    '''              {t.label}
            </Link>
          );
        })}
      </div>''',
    '''              {t.label}
            </Link>
          );
        })}
        {/* Spacer to guarantee empty space at the end so the last capsule isn't faded by the mask */}
        <div className="w-6 shrink-0" />
      </div>'''
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Added right spacer to fix last capsule cutoff.")
