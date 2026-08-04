import re

with open("c:/Users/vh142/OneDrive/Área de Trabalho/SERRA RESOLUÇÃO/Serra Site/style.css", "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(
    r":root\s*\{.*?\/\*\s*Layout\s*\*\/",
    """:root {
    /* Color System - Mountain Blue Gradient Logo */
    --primary: #1D5DAE;
    --primary-light: #2a73d3;
    --accent: #4CB8DF;
    --accent-hover: #3ca2c7;
    
    --brand-gradient: linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%);
    --brand-gradient-hover: linear-gradient(135deg, var(--accent-hover) 0%, #174b8f 100%);
    
    --surface: #FFFFFF;
    --background: #F8FAFC;    
    --surface-alt: #F1F5F9;   
    
    --text-strong: #0e1e32;   
    --text-main: #334155;     
    --text-muted: #888888;    
    
    --border-color: #E2E8F0;  
    
    /* Layout */""",
    content,
    flags=re.DOTALL
)

content = re.sub(
    r"\.hero\s*\{.*?\}",
    """.hero {
    margin-top: 88px;
    position: relative;
    min-height: 85vh;
    display: flex;
    align-items: center;
    background: var(--brand-gradient);
    color: var(--surface);
    overflow: hidden;
    text-align: center;
}""",
    content,
    flags=re.DOTALL
)

content = re.sub(
    r"\.hero-bg-pattern\s*\{.*?\}",
    """.hero-bg-pattern {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 60%),
                      radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.2) 0%, transparent 50%);
    z-index: 1;
}""",
    content,
    flags=re.DOTALL
)

with open("c:/Users/vh142/OneDrive/Área de Trabalho/SERRA RESOLUÇÃO/Serra Site/style.css", "w", encoding="utf-8") as f:
    f.write(content)
