import bpy
import json
objects = bpy.context.selected_objects
result = {} 
for item in bpy.context.selected_objects:
    result[item.name]  ={
        "position": [ item.location.x,  item.location.z, -item.location.y],
        "scale": [ -item.scale.x, item.scale.z, item.scale.y ],
        "rotation": [ item.rotation_euler.x, item.rotation_euler.z, item.rotation_euler.y ]
    }
    
with open('D:\data.txt', "w") as f:
    json.dump(result, f)

with open('D:\data.txt', 'r+') as f:
        content = f.read()
        f.seek(0, 0)
        f.write('export const data=' + content)