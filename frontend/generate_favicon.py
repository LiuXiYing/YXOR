from PIL import Image, ImageDraw

# 打开 PNG 文件
img = Image.open('public/favicon.png')

# 转换为 RGB
if img.mode in ('RGBA', 'LA', 'P'):
    background = Image.new('RGB', img.size, (255, 255, 255))
    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
    img = background

# 调整大小，留出边距
favicon_size = (32, 32)
inner_size = 28
img_resized = img.resize((inner_size, inner_size), Image.Resampling.LANCZOS)

# 创建白色背景的 favicon
favicon = Image.new('RGBA', favicon_size, (255, 255, 255, 255))

# 计算位置（居中）
offset = (favicon_size[0] - inner_size) // 2
favicon.paste(img_resized, (offset, offset))

# 创建圆形 mask
mask = Image.new('L', favicon_size, 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.ellipse([0, 0, favicon_size[0]-1, favicon_size[1]-1], fill=255)

# 应用圆形 mask
circular_img = Image.new('RGBA', favicon_size, (0, 0, 0, 0))
circular_img.paste(favicon, mask=mask)

# 保存为 ICO 文件
circular_img.save('public/favicon.ico')

print("✅ 优化后的圆形 favicon.ico 已生成成功！")
