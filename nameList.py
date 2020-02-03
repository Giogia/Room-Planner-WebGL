import os

for file in sorted(os.listdir(os.path.join(os.getcwd(), 'three', 'models', 'nature', 'trees'))):
    if file.endswith('.glb'):
        print("'" + os.path.splitext(file)[0] + "',")

