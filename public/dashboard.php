<?php
// public/dashboard.php
// ========== INICIALIZAÇÃO E VALIDAÇÃO ==========

session_start();
header('Content-Type: text/html; charset=utf-8');
require_once '../config/config.php';

// 1. Verificar se usuário está logado
if (!isset($_SESSION['user_logged_in']) || $_SESSION['user_logged_in'] !== true) {
    header('Location: ../auth/login.php');
    exit;
}

$user_id = $_SESSION['user_id'];

// 2. Buscar dados atualizados do usuário
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

// 3. VALIDAÇÃO CRÍTICA: Verificar se usuário existe no banco
if (!$user) {
    session_destroy();
    header('Location: ../auth/login.php');
    exit;
}

// 4. Buscar links do usuário (garantir que seja sempre array)
$stmt = $pdo->prepare("SELECT * FROM links WHERE user_id = ? ORDER BY ordem ASC");
$stmt->execute([$user_id]);
$links = $stmt->fetchAll() ?: [];  // Garante array vazio se fetchAll() retornar false

// 5. Inicializar variáveis com null coalescing para evitar warnings
$public_url = 'https://linkwave.ct.ws/public/profile.php?username=' . htmlspecialchars($user['username'] ?? 'user');

// 6. Avatar: prioridade avatar_blob > avatar > fallback com segurança
$avatar = !empty($user['avatar_blob']) 
    ? $user['avatar_blob']
    : (!empty($user['avatar']) 
        ? $user['avatar']
        : "https://ui-avatars.com/api/?name=" . urlencode($user['nome'] ?? 'User') . "&size=128&background=4CAF50&color=fff"
    );

// 7. Estatísticas
$total_cliques = (int)($user['total_cliques'] ?? 0);
$total_views = (int)($user['total_views'] ?? 0);
$ctr = $total_views > 0 ? round(($total_cliques / $total_views) * 100, 2) : 0;

// 8. Lista de ícones disponíveis (com todos os ícones suportados)
$icones_disponiveis = [
    'airbnb' => 'Airbnb',
    'discord' => 'Discord',
    'duolingo' => 'Duolingo',
    'facebook-messenger' => 'Messenger',
    'facebook' => 'Facebook',
    'github' => 'GitHub',
    'gmail' => 'Gmail',
    'instagram' => 'Instagram',
    'linkedin' => 'LinkedIn',
    'netflix' => 'Netflix',
    'notion' => 'Notion',
    'paypal' => 'PayPal',
    'pinterest' => 'Pinterest',
    'reddit' => 'Reddit',
    'skype' => 'Skype',
    'snapchat' => 'Snapchat',
    'soundcloud' => 'SoundCloud',
    'spotify' => 'Spotify',
    'steam' => 'Steam',
    'telegram' => 'Telegram',
    'tiktok' => 'TikTok',
    'tinder' => 'Tinder',
    'twitch' => 'Twitch',
    'twitter' => 'Twitter',
    'whatsapp' => 'WhatsApp',
    'youtube' => 'YouTube'
];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="./assets/icons/icon.png" type="image/png">
    <script src="https://cdn.tailwindcss.com" defer></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style" onload="this.rel='stylesheet'">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js" defer></script>
    <style>
        * { font-family: 'Nunito', sans-serif; margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: linear-gradient(160deg, #a8edcf 0%, #78d4f0 35%, #4ab8f5 60%, #6ec6f7 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .blob {
            position: fixed; border-radius: 50%; filter: blur(80px);
            opacity: 0.45; animation: blobFloat 10s ease-in-out infinite alternate;
            pointer-events: none; z-index: 0;
        }
        .blob-1 { width:600px;height:600px;background:radial-gradient(circle,#a0f0d0,#4dd9f5);top:-100px;left:-150px;animation-delay:0s; }
        .blob-2 { width:500px;height:500px;background:radial-gradient(circle,#b8eaff,#72c8f8);bottom:-100px;right:-100px;animation-delay:3s; }
        .blob-3 { width:350px;height:350px;background:radial-gradient(circle,#d0f8e8,#8de8f5);top:40%;left:50%;transform:translate(-50%,-50%);animation-delay:1.5s; }
        
        @keyframes blobFloat {
            0% { transform: scale(1) translate(0,0); }
            100% { transform: scale(1.12) translate(20px,-20px); }
        }

        .content { position: relative; z-index: 1; }

        .glass {
            background: rgba(255,255,255,0.38);
            backdrop-filter: blur(18px) saturate(180%);
            border: 1.5px solid rgba(255,255,255,0.7);
            border-radius: 28px;
            box-shadow: 0 8px 32px rgba(80,180,220,0.18), inset 0 1px 0 rgba(255,255,255,0.8);
        }
        
        .glass-sm {
            background: rgba(255,255,255,0.32);
            backdrop-filter: blur(14px);
            border: 1.5px solid rgba(255,255,255,0.65);
            border-radius: 20px;
            box-shadow: 0 4px 16px rgba(80,180,220,0.14), inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .glass-card {
            background: rgba(255,255,255,0.42);
            backdrop-filter: blur(14px);
            border: 1.5px solid rgba(255,255,255,0.72);
            border-radius: 24px;
            box-shadow: 0 8px 28px rgba(80,180,220,0.15), inset 0 1px 0 rgba(255,255,255,0.9);
            transition: all 0.25s;
        }
        .glass-card:hover {
            background: rgba(255,255,255,0.52);
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(80,180,220,0.22), inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .modal-dialog {
            background: rgba(255, 255, 255, 0.96);
            border: 1px solid rgba(190, 210, 255, 0.9);
            box-shadow: 0 16px 40px rgba(15, 50, 105, 0.45);
            color: #1d355d;
        }

        /* Navbar */
        nav { position: sticky; top: 0; z-index: 50; padding: 0.75rem 0; }
        .nav-inner {
            background: rgba(255,255,255,0.5);
            backdrop-filter: blur(20px);
            border: 1.5px solid rgba(255,255,255,0.75);
            border-radius: 999px;
            padding: 0.6rem 1.5rem;
            display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 4px 20px rgba(80,180,220,0.15), inset 0 1px 0 rgba(255,255,255,0.9);
        }

        /* Buttons */
        .btn-blue {
            background: linear-gradient(180deg, #5bc8f5 0%, #2aa8e0 100%);
            border: 1.5px solid rgba(255,255,255,0.6);
            border-radius: 999px; padding: 0.55rem 1.4rem;
            color: white; font-weight: 700; font-size: 0.9rem;
            text-shadow: 0 1px 2px rgba(0,0,0,0.15);
            box-shadow: 0 4px 14px rgba(42,168,224,0.4), inset 0 1px 0 rgba(255,255,255,0.5);
            transition: all 0.25s; display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .btn-blue:hover { background: linear-gradient(180deg,#72d4f8,#3ab8f0); transform: translateY(-1px); }

        .btn-green {
            background: linear-gradient(180deg, #5ed490 0%, #28b060 100%);
            border: 1.5px solid rgba(255,255,255,0.6);
            border-radius: 999px; padding: 0.7rem 1.6rem;
            color: white; font-weight: 800;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            box-shadow: 0 4px 16px rgba(40,176,96,0.4), inset 0 1px 0 rgba(255,255,255,0.5);
            transition: all 0.25s; display: inline-flex; align-items: center; gap: 0.5rem;
            width: 100%; justify-content: center;
        }
        .btn-green:hover { background: linear-gradient(180deg,#72e0a0,#38c070); transform: translateY(-1px); }

        .btn-ghost {
            background: rgba(255,255,255,0.35);
            border: 1.5px solid rgba(255,255,255,0.7);
            border-radius: 999px; padding: 0.5rem 1.2rem;
            color: #1a6a9a; font-weight: 700; font-size: 0.85rem;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
            transition: all 0.25s; display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.55); transform: translateY(-1px); }

        .btn-red {
            background: rgba(255,255,255,0.3);
            border: 1.5px solid rgba(255,100,100,0.3);
            border-radius: 999px; padding: 0.5rem 1.1rem;
            color: #c0392b; font-weight: 700; font-size: 0.85rem;
            transition: all 0.25s; display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .btn-red:hover { background: rgba(255,80,80,0.12); transform: translateY(-1px); }

        /* Text */
        .text-ocean { color: #1a6a9a; }
        .text-ocean-light { color: #2a8abf; }
        .text-muted { color: rgba(30,80,120,0.55); }

        /* Float logo */
        .float-logo {
            animation: floatLogo 4s ease-in-out infinite;
            filter: drop-shadow(0 3px 8px rgba(80,180,220,0.35));
        }
        @keyframes floatLogo {
            0%,100% { transform: translateY(0) rotate(-1deg); }
            50% { transform: translateY(-6px) rotate(1deg); }
        }

        /* Avatar ring */
        .avatar-ring {
            border: 3px solid rgba(255,255,255,0.85);
            box-shadow: 0 4px 16px rgba(80,180,220,0.3), 0 0 0 2px rgba(91,200,245,0.4);
        }

        /* Stat card */
        .stat-card {
            background: rgba(255,255,255,0.45);
            border: 1.5px solid rgba(255,255,255,0.8);
            border-radius: 20px; padding: 1rem 1.2rem; text-align: center;
            box-shadow: 0 4px 16px rgba(80,180,220,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
        }

        /* Input */
        .aero-input {
            background: rgba(255,255,255,0.45);
            backdrop-filter: blur(10px);
            border: 1.5px solid rgba(255,255,255,0.75);
            border-radius: 16px; padding: 0.7rem 1rem;
            color: #1a4a6a; width: 100%; font-size: 0.95rem; font-weight: 500;
            box-shadow: inset 0 1px 3px rgba(80,160,200,0.1), inset 0 -1px 0 rgba(255,255,255,0.6);
            transition: all 0.25s;
        }
        .aero-input:focus {
            outline: none;
            border-color: rgba(91,200,245,0.8);
            background: rgba(255,255,255,0.6);
            box-shadow: 0 0 0 3px rgba(91,200,245,0.2), inset 0 1px 3px rgba(80,160,200,0.1);
        }
        .aero-input::placeholder { color: rgba(30,80,120,0.4); }

        /* Select */
        .aero-select {
            background: rgba(255,255,255,0.45);
            backdrop-filter: blur(10px);
            border: 1.5px solid rgba(255,255,255,0.75);
            border-radius: 16px; padding: 0.7rem 1rem;
            color: #1a4a6a; width: 100%; font-size: 0.95rem; font-weight: 500;
            cursor: pointer;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
        }
        .aero-select option { background: #d0eef8; color: #1a4a6a; }

        /* Toast notifications */
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(400px);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .toast.show {
            transform: translateX(0);
        }
        .toast.success {
            background: rgba(40, 176, 96, 0.9);
            box-shadow: 0 4px 20px rgba(40, 176, 96, 0.3);
        }
        .toast.error {
            background: rgba(192, 57, 43, 0.9);
            box-shadow: 0 4px 20px rgba(192, 57, 43, 0.3);
        }

        /* Enhanced animations */
        .fade-in {
            animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .slide-in-left {
            animation: slideInLeft 0.5s ease-out forwards;
        }
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .bounce-in {
            animation: bounceIn 0.6s ease-out forwards;
        }
        @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
        }

        /* Loading states */
        .loading-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
            z-index: 10;
        }

        /* Enhanced link cards */
        .link-card {
            background: rgba(255,255,255,0.42);
            backdrop-filter: blur(14px);
            border: 1.5px solid rgba(255,255,255,0.72);
            border-radius: 20px; padding: 1rem 1.2rem;
            display: flex; align-items: center; gap: 1rem;
            box-shadow: 0 4px 16px rgba(80,180,220,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: move;
            position: relative;
            overflow: hidden;
        }
        .link-card::before {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.5s;
        }
        .link-card:hover::before {
            left: 100%;
        }
        .link-card:hover {
            background: rgba(255,255,255,0.58);
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 32px rgba(80,180,220,0.25), inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .link-card:active {
            transform: translateY(-1px) scale(0.98);
        }

        /* SortableJS drag and drop styles */
        .link-card.sortable-ghost {
            opacity: 0.4;
            background: rgba(255, 255, 255, 0.2);
            border: 2px dashed rgba(91, 200, 245, 0.8);
            box-shadow: 0 4px 12px rgba(80, 180, 220, 0.2) inset;
        }

        .link-card.sortable-drag {
            opacity: 1;
            background: rgba(255, 255, 255, 0.85);
            box-shadow: 0 12px 40px rgba(80, 180, 220, 0.4);
            transform: scale(1.02) rotate(2deg) !important;
        }

        .link-card.sortable-chosen {
            background: rgba(255, 255, 255, 0.65);
            border-color: rgba(91, 200, 245, 1);
        }

        /* Drag handle */
        .drag-handle {
            cursor: grab;
            padding: 0.5rem;
            color: rgba(26, 106, 154, 0.5);
            transition: all 0.2s ease;
            min-width: 1.2rem;
        }

        .drag-handle:hover {
            color: rgba(26, 106, 154, 0.9);
            transform: scale(1.1);
        }

        .link-card.sortable-drag .drag-handle {
            cursor: grabbing;
            color: rgba(26, 106, 154, 1);
        }

        /* Sortable container visual feedback */
        #linksContainer.sortable-active {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 0.5rem;
        }

        /* Icon bubble para PNGs - CORRIGIDO PARA BORDAS ARREDONDADAS */
        .icon-bubble {
            width: 2.8rem; height: 2.8rem; 
            border-radius: 50% !important; /* ⭐ FORÇA borda arredondada */
            flex-shrink: 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(230,245,255,0.8));
            border: 2px solid rgba(255,255,255,0.95);
            box-shadow: 0 4px 12px rgba(80,180,220,0.2);
            display: flex; 
            align-items: center; 
            justify-content: center;
            overflow: hidden; /* ⭐ CRÍTICO: Impede vazamento de imagem */
        }
        
        /* TODAS as imagens dentro do icon-bubble */
        .icon-bubble img {
            width: 100% !important;
            height: 100% !important;
            max-width: 100%;
            max-height: 100%;
            border-radius: 50% !important; /* ⭐ GARANTE borda redonda */
            object-fit: cover !important; /* ⭐ PREENCHE o círculo sem distorcer */
            display: block;
        }
        
        /* Para ícones padrão (PNG 8-bit) que devem manter proporção */
        .icon-bubble img.default-icon-img,
        .icon-bubble img[src*="/icons/8-bit/"] {
            object-fit: contain !important;
            padding: 0.25rem;
        }
        
        /* Para ícones customizados (uploads do usuário) */
        .icon-bubble img.custom-icon-img,
        .icon-bubble img[src*="data:image"] {
            object-fit: cover !important;
            border-radius: 50% !important;
        }

        /* Drag hint */
        .drag-hint {
            background: rgba(255,255,255,0.25);
            border: 1.5px dashed rgba(255,255,255,0.6);
            border-radius: 16px;
        }

        /* Tag */
        .aero-tag {
            background: rgba(255,255,255,0.55);
            border: 1.5px solid rgba(255,255,255,0.8);
            border-radius: 999px; padding: 0.25rem 0.9rem;
            font-size: 0.78rem; color: #2a7aaf; font-weight: 700;
            display: inline-block;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
        }

        /* Section label */
        .section-label {
            font-size: 0.75rem; font-weight: 800; text-transform: uppercase;
            letter-spacing: 0.08em; color: rgba(30,80,120,0.45);
        }

        /* Empty state */
        .empty-state {
            background: rgba(255,255,255,0.25);
            border: 2px dashed rgba(255,255,255,0.6);
            border-radius: 24px; padding: 3rem; text-align: center;
        }

        /* ========== CUSTOM TOGGLE STYLES ========== */
        
        /* Toggle Radio Label */
        .icon-mode-toggle input[type="radio"] {
            display: none;
        }

        .icon-mode-toggle input[type="radio"]:checked + .icon-mode-label {
            border-color: #2563eb;
            background: linear-gradient(135deg, rgb(219, 234, 254), rgb(224, 242, 254));
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
            transform: translateY(-2px);
        }

        .icon-mode-toggle input[type="radio"]:checked + .icon-mode-label i {
            color: #1e40af;
        }

        .icon-mode-label {
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .icon-mode-label:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Section show/hide with animation */
        #predefined_icon_section.hidden,
        #custom_icon_section.hidden {
            display: none !important;
        }

        #predefined_icon_section,
        #custom_icon_section {
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Upload button enhanced */
        #custom_icon_btn {
            border-color: rgba(37, 99, 235, 0.4);
        }

        #custom_icon_btn:hover {
            border-color: rgba(37, 99, 235, 0.8);
            background-color: rgba(59, 130, 246, 0.05);
        }

        #custom_icon_btn:active {
            transform: scale(0.98);
        }

        /* Preview container */
        #custom_icon_preview.hidden {
            display: none !important;
        }
    </style>
</head>
<body>
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <div class="content fade-in">

        <!-- Dados dos links atuais em JSON (para validação frontend) -->
        <script>
            const LINKS_ATUAIS = <?php echo json_encode($links ?? []); ?>;
            const assetsUrl = '<?= ASSETS_URL ?>';
        </script>

        <!-- Navbar -->
        <nav class="slide-in-left" aria-label="Principal">
            <div class="container mx-auto px-4">
                <div class="nav-inner" role="navigation">
                    <a href="./index.php" class="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity" aria-label="Home LinkWave">
                        <img src="./assets/icons/icon.png" alt="LinkWave" class="w-9 h-9 float-logo">
                        <span class="font-black text-xl text-ocean">LinkWave</span>
                    </a>
                    <div class="flex items-center gap-2">
                    <a href="customize.php" class="btn-ghost" aria-label="Personalizar">
                        <i class="fa-solid fa-palette text-xs" aria-hidden="true"></i>
                        <span class="hidden sm:inline">Personalizar</span>
                    </a>
                    <a href="<?= BASE_URL ?>/public/profile.php?username=<?php echo htmlspecialchars($user['username']); ?>" target="_blank" class="btn-ghost" aria-label="Ver página pública">
                        <i class="fa-solid fa-eye text-xs" aria-hidden="true"></i>
                        <span class="hidden sm:inline">Ver página</span>
                    </a>
                        <a href="../auth/logout.php" class="btn-ghost" aria-label="Sair">
                            <i class="fa-solid fa-right-from-bracket text-xs" aria-hidden="true"></i>
                            <span class="hidden sm:inline">Sair</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>

        <main role="main" class="container mx-auto px-4 py-8 max-w-6xl">

            <!-- Profile Card -->
            <div class="glass p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                <div class="relative flex-shrink-0">
                    <img src="<?php echo htmlspecialchars($avatar); ?>" alt="Avatar"
                         class="w-20 h-20 rounded-full avatar-ring object-cover">
                    <a href="customize.php" class="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border-2 border-blue-200 flex items-center justify-center shadow-md hover:scale-110 transition" title="Editar avatar e banner" aria-label="Editar avatar e banner">
                        <i class="fa-solid fa-camera text-ocean text-xs" aria-hidden="true"></i>
                    </a>
                </div>

                <div class="flex-1 text-center md:text-left">
                    <div class="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                        <h2 class="font-black text-2xl text-ocean">@<?php echo htmlspecialchars($user['username']); ?></h2>
                        <span class="aero-tag" aria-hidden="true">✦ Ativo</span>
                    </div>
                    <p class="text-sm mb-3 text-ocean font-semibold">
                        <span id="nomeText"><?php echo htmlspecialchars($user['nome'] ?? 'Seu nome'); ?></span>
                        <button onclick="openNomeModal()" class="ml-1 w-5 h-5 rounded-full bg-white/60 inline-flex items-center justify-center hover:bg-white transition text-ocean text-xs" title="Editar nome" aria-label="Editar nome">
                            <i class="fa-solid fa-pen" style="font-size:9px" aria-hidden="true"></i>
                        </button>
                    </p>
                    <p class="text-muted text-sm mb-3">
                        <span id="bioText"><?php echo htmlspecialchars($user['bio'] ?? 'Sem bio ainda'); ?></span>
                        <button onclick="openBioModal()" class="ml-1 w-5 h-5 rounded-full bg-white/60 inline-flex items-center justify-center hover:bg-white transition text-ocean" title="Editar bio" aria-label="Editar bio">
                            <i class="fa-solid fa-pen" style="font-size:9px" aria-hidden="true"></i>
                        </button>
                    </p>
                    <div class="flex items-center justify-center md:justify-start gap-2 text-sm text-ocean-light">
                        <i class="fa-solid fa-link text-xs" aria-hidden="true"></i>
                        <span class="font-semibold" id="publicUrlText"><?php echo htmlspecialchars($public_url); ?></span>
                        <button onclick="copyToClipboard(event, '<?php echo $public_url; ?>')" class="w-6 h-6 rounded-full bg-white/60 flex items-center justify-center hover:bg-white transition text-ocean" aria-label="Copiar URL pública">
                            <i class="fa-regular fa-copy text-xs" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>

                <!-- Stats -->
                <div class="flex gap-4">
                    <div class="stat-card" role="status" aria-label="Total de links">
                        <div class="font-black text-2xl text-ocean-light"><?php echo count($links); ?></div>
                        <div class="text-muted text-xs mt-0.5">Links</div>
                    </div>
                    <div class="stat-card" role="status" aria-label="Total de cliques">
                        <div class="font-black text-2xl text-ocean-light"><?php echo $total_cliques; ?></div>
                        <div class="text-muted text-xs mt-0.5">Cliques</div>
                    </div>
                    <div class="stat-card" role="status" aria-label="CTR">
                        <div class="font-black text-2xl text-ocean-light"><?php echo $ctr; ?>%</div>
                        <div class="text-muted text-xs mt-0.5">CTR</div>
                        <div class="text-muted mt-1" style="font-size:9px"><?php echo $total_cliques; ?> cliques / <?php echo $total_views; ?> views</div>
                    </div>
                   
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid lg:grid-cols-3 gap-6">

                <!-- Left: Create link form -->
                <div class="lg:col-span-1">
                    <div class="glass p-6 sticky top-20">
                        <div class="flex items-center gap-2 mb-5">
                            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-300 to-cyan-400 flex items-center justify-center shadow-md">
                                <i class="fa-solid fa-plus text-white text-sm"></i>
                            </div>
                            <h3 class="font-black text-lg text-ocean">Novo link</h3>
                        </div>

                        <form id="createLinkForm" class="space-y-4">
                            <!-- Título -->
                            <div>
                                <label class="section-label block mb-1.5">Título</label>
                                <input type="text" id="link_title" placeholder="Ex: Meu Instagram" class="aero-input" required>
                            </div>

                            <!-- URL -->
                            <div>
                                <label class="section-label block mb-1.5">URL</label>
                                <input type="url" id="link_url" placeholder="https://..." class="aero-input" required>
                            </div>

                            <!-- ========== CUSTOM TOGGLE: Ícone vs Imagem ========== -->
                            <div class="space-y-3">
                                <label class="section-label block mb-2">Como adicionar o ícone?</label>
                                
                                <!-- Toggle Container -->
                                <div class="flex gap-2">
                                    <!-- Opção 1: Ícone Padrão -->
                                    <label class="icon-mode-toggle flex-1 cursor-pointer">
                                        <input type="radio" name="icon_mode" value="predefined" class="hidden" checked>
                                        <div class="icon-mode-label p-3 rounded-lg border-2 border-blue-300 bg-blue-50 text-center transition-all hover:border-blue-500">
                                            <div class="flex items-center justify-center gap-2">
                                                <i class="fa-solid fa-images text-ocean text-lg"></i>
                                                <span class="font-semibold text-sm text-ocean">Predefinido</span>
                                            </div>
                                            <p class="text-xs text-muted mt-1">27 redes sociais</p>
                                        </div>
                                    </label>

                                    <!-- Opção 2: Imagem Customizada -->
                                    <label class="icon-mode-toggle flex-1 cursor-pointer">
                                        <input type="radio" name="icon_mode" value="custom" class="hidden">
                                        <div class="icon-mode-label p-3 rounded-lg border-2 border-gray-300 bg-white text-center transition-all hover:border-blue-500">
                                            <div class="flex items-center justify-center gap-2">
                                                <i class="fa-solid fa-upload text-muted text-lg"></i>
                                                <span class="font-semibold text-sm text-ocean">Customizado</span>
                                            </div>
                                            <p class="text-xs text-muted mt-1">Sua imagem</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- ========== SEÇÃO: ÍCONE PREDEFINIDO ========== -->
                            <div id="predefined_icon_section" class="space-y-2">
                                <label class="section-label block mb-1.5">Selecione um ícone</label>
                                <select id="link_icon" class="aero-select">
                                    <option value="">-- Escolha um --</option>
                                    <?php foreach ($icones_disponiveis as $key => $nome): ?>
                                    <option value="<?php echo $key; ?>"><?php echo $nome; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <div class="mt-2 flex items-center gap-2 text-xs text-muted">
                                    <img src="./assets/icons/8-bit/instagram.png" alt="" class="w-4 h-4 opacity-50">
                                    <span>PNGs estilo 8-bit</span>
                                </div>
                            </div>

                            <!-- ========== SEÇÃO: IMAGEM CUSTOMIZADA ========== -->
                            <div id="custom_icon_section" class="hidden space-y-3">
                                <label class="section-label block mb-2">Carregue sua imagem</label>
                                
                                <!-- Input File (Hidden) -->
                                <input type="file" id="custom_icon_input" accept="image/*" class="hidden">
                                
                                <!-- Upload Button -->
                                <button type="button" id="custom_icon_btn" class="w-full border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                                    <div class="flex flex-col items-center gap-2">
                                        <i class="fa-solid fa-cloud-arrow-up text-blue-500 text-2xl"></i>
                                        <div>
                                            <p class="font-semibold text-sm text-ocean">Clique para enviar</p>
                                            <p class="text-xs text-muted">PNG, JPG, GIF até 2MB</p>
                                        </div>
                                    </div>
                                </button>

                                <!-- Image Preview -->
                                <div id="custom_icon_preview" class="hidden p-3 bg-green-50 border border-green-300 rounded-lg">
                                    <div class="flex items-center gap-3">
                                        <img id="preview_img" src="" alt="Preview" class="w-16 h-16 object-contain rounded border border-green-200 bg-white p-1">
                                        <div class="flex-1 min-w-0">
                                            <p id="preview_name" class="text-sm font-bold text-ocean truncate">Imagem carregada</p>
                                            <p class="text-xs text-muted mt-1">
                                                <i class="fa-solid fa-check text-green-600 mr-1"></i>
                                                Pronto para usar
                                            </p>
                                            <button type="button" id="remove_custom_icon" class="text-xs text-red-600 hover:text-red-800 hover:underline mt-1">
                                                ✕ Remover imagem
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <button type="submit" class="btn-green w-full">
                                <i class="fa-solid fa-plus"></i> Adicionar link
                            </button>
                        </form>

                        <p class="text-muted text-xs mt-4 text-center">
                            <i class="fa-regular fa-lightbulb mr-1" style="color:#28b060"></i>
                            Links aparecem na sua página imediatamente
                        </p>
                    </div>
                </div>

                <!-- Right: Links list -->
                <div class="lg:col-span-2">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2">
                            <h3 class="font-black text-xl text-ocean">Seus links</h3>
                            <span class="aero-tag" id="linksCountTag"><?php echo count($links); ?> links</span>
                        </div>
                        <div class="drag-hint px-3 py-1.5 text-muted text-xs flex items-center gap-1.5">
                            <i class="fa-solid fa-arrows-up-down text-xs"></i>
                            <span class="hidden sm:inline">Arraste para reordenar</span>
                        </div>
                    </div>

                    <div class="space-y-3" id="linksContainer">
                        <?php if (!empty($links)): ?>
                            <?php foreach($links as $index => $link): ?>
                            <div class="link-card fade-in" data-id="<?php echo $link['id']; ?>" style="animation-delay: <?php echo $index * 0.1; ?>s" role="listitem">
                                <div class="drag-handle" title="Arraste para reordenar" tabindex="0" aria-label="Alça de arrastar (use as setas para mover)">
                                    <i class="fa-solid fa-grip-vertical"></i>
                                </div>
                                <div class="icon-bubble">
                                    <?php
                                    // Verificar se é ícone customizado
                                    if (!empty($link['is_custom_icon']) && !empty($link['icon_blob'])):
                                    ?>
                                        <img src="<?php echo htmlspecialchars($link['icon_blob']); ?>" 
                                             alt="<?php echo htmlspecialchars($link['titulo']); ?>"
                                             class="custom-icon-img"
                                             style="width:100%; height:100%; object-fit:cover; border-radius:50%;"
                                             onerror="this.outerHTML='<i class=&quot;fa-solid fa-link text-ocean-light text-lg&quot;></i>'">
                                    <?php elseif (!empty($link['icone'])): 
                                        $caminho_icone = ASSETS_URL . '/icons/8-bit/' . $link['icone'] . '.png';
                                        $caminho_fisico = PUBLIC_PATH . '/assets/icons/8-bit/' . $link['icone'] . '.png';
                                        
                                        if (file_exists($caminho_fisico)): 
                                    ?>
                                        <img src="<?php echo $caminho_icone; ?>" 
                                             alt="<?php echo htmlspecialchars($link['titulo']); ?>"
                                             class="default-icon-img"
                                             style="width:100%; height:100%; object-fit:contain;"
                                             onerror="this.outerHTML='<i class=&quot;fa-solid fa-link text-ocean-light text-lg&quot;></i>'">
                                    <?php else: ?>
                                        <i class="fa-solid fa-link text-ocean-light text-lg"></i>
                                    <?php endif; ?>
                                    <?php else: ?>
                                        <i class="fa-solid fa-link text-ocean-light text-lg"></i>
                                    <?php endif; ?>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-bold text-ocean truncate"><?php echo htmlspecialchars($link['titulo']); ?></h4>
                                    <p class="text-muted text-xs truncate mt-0.5"><?php echo htmlspecialchars($link['url']); ?></p>
                                </div>
                                <div class="flex items-center gap-1.5 flex-shrink-0">
                                    <button class="btn-ghost" onclick="editLink(<?php echo $link['id']; ?>, event)">
                                        <i class="fa-solid fa-pen text-xs"></i>
                                        <span class="hidden md:inline">Editar</span>
                                    </button>
                                    <button class="btn-red" onclick="deleteLink(<?php echo $link['id']; ?>)">
                                        <i class="fa-solid fa-trash text-xs"></i>
                                        <span class="hidden md:inline">Excluir</span>
                                    </button>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div class="empty-state">
                                <img src="./assets/icons/icon.png" alt="LinkWave" class="w-14 h-14 mx-auto mb-4 opacity-40 float-logo">
                                <p class="text-ocean font-bold mb-1">Nenhum link ainda</p>
                                <p class="text-muted text-sm">Crie seu primeiro link no painel ao lado</p>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Mobile preview button -->
                    <div class="mt-5 lg:hidden">    
                        <a href="/<?php echo htmlspecialchars($user['username']); ?>" target="_blank" class="btn-green">
                            <i class="fa-solid fa-eye"></i> Ver minha página pública
                        </a>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="container mx-auto px-4 pb-6 mt-8">
            <div class="glass-sm p-4 flex flex-col sm:flex-row justify-between items-center text-muted text-sm gap-3">
                <a href="./index.php" class="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
                    <img src="./assets/icons/icon.png" alt="LinkWave" class="w-5 h-5 opacity-60">
                    <span class="font-bold text-ocean-light">LinkWave</span>
                </a>
                <div class="text-xs">Dashboard v1.0</div>
            </div>
        </footer>

    </div>

    <!-- Toast region for screen readers -->
    <div id="toastRegion" aria-live="polite" aria-atomic="true" style="position:fixed; top:20px; right:20px; z-index:1200;"></div>

    <script>
        // Toast notification system
        function showToast(message, type = 'success') {
            const region = document.getElementById('toastRegion') || document.body;
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.textContent = message;
            region.appendChild(toast);

            // entrance
            requestAnimationFrame(() => toast.classList.add('show'));

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // 🚨 VALIDAÇÕES EM TEMPO REAL
        function validarURLDuplicada(url, linkIdAExcluir = null) {
            return LINKS_ATUAIS.some(link => 
                link.url === url && link.id != linkIdAExcluir
            );
        }

        function validarIconeDuplicado(icone, linkIdAExcluir = null) {
            return LINKS_ATUAIS.some(link => 
                link.icone === icone && link.id != linkIdAExcluir
            );
        }

        function atualizarValidacaoFormulario(formId, isCriacao = true) {
            const form = document.getElementById(formId);
            if (!form) return;

            const urlInput = form.querySelector('[id*="url"]');
            const iconSelect = form.querySelector('[id*="icon"]');
            const submitBtn = form.querySelector('button[type="submit"]');
            const linkIdAExcluir = form.dataset.linkId || null;

            if (!urlInput || !iconSelect || !submitBtn) return;

            const url = urlInput.value.trim();
            const icone = iconSelect.value;

            let erros = [];
            let avisos = [];

            // Validação de URL duplicada
            if (url && validarURLDuplicada(url, linkIdAExcluir)) {
                erros.push('🔗 Esta URL já está em uso');
            }

            // Validação de ícone duplicado
            if (icone && validarIconeDuplicado(icone, linkIdAExcluir)) {
                erros.push('🎨 Este ícone já está em uso');
            }

            // Atualizar UI
            if (erros.length > 0) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.5';
                submitBtn.title = erros.join(' | ');
            } else {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.title = '';
            }
        }

        // Função para copiar URL
        function copyToClipboard(evt, text) {
            if (!text) {
                showToast('❌ Erro ao copiar link', 'error');
                return;
            }
            
            navigator.clipboard.writeText(text).then(() => {
                const btn = evt.target.closest('button') || evt.currentTarget;
                const icon = btn.querySelector('i');
                const originalClass = icon.className;
                icon.className = 'fa-solid fa-check text-xs';
                showToast('✅ Link copiado!', 'success');
                setTimeout(() => { icon.className = originalClass; }, 1500);
            }).catch(err => {
                showToast('❌ Erro ao copiar link', 'error');
                console.error('Erro ao copiar:', err);
            });
        }

        // ✅ Enhanced edit link function with modal
        function editLink(id, ev) {
            // Pegar o card do link
            let linkCard = null;
            try {
                if (ev && ev.target) {
                    linkCard = ev.target.closest('.link-card');
                }
            } catch (e) { /* ignore */ }
            if (!linkCard) linkCard = document.querySelector(`.link-card[data-id="${id}"]`);
            if (!linkCard) {
                showToast('❌ Não foi possível localizar o link para edição', 'error');
                return;
            }
            
            // Pegar dados atuais
            const tituloAtual = linkCard.querySelector('h4') ? linkCard.querySelector('h4').textContent : '';
            const urlAtual = linkCard.querySelector('p') ? linkCard.querySelector('p').textContent : '';
            
            // ✅ Sanitizar valores para uso seguro em HTML
            function escapeHtml(str) {
                if (!str) return '';
                return String(str)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            }
            
            const safeTitulo = escapeHtml(tituloAtual);
            const safeUrl = escapeHtml(urlAtual);
            
            // Descobrir o ícone atual
            let iconeAtual = '';
            const img = linkCard.querySelector('.icon-bubble img');
            if (img && img.src.includes('data:')) {
                // É ícone customizado (data URL)
                iconeAtual = '';
            } else if (img) {
                // É ícone padrão
                const src = img.src;
                const match = src.match(/\/([^\/]+)\.png$/);
                if (match) iconeAtual = match[1];
            }
            
            // Gerar UUID para input file único
            const fileInputId = 'custom_icon_edit_' + Math.random().toString(36).substr(2, 9);
            
            // Criar modal de edição
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div class="glass-strong modal-dialog rounded-3xl p-6 w-full max-w-md bounce-in max-h-screen overflow-y-auto">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xl font-bold text-ocean">Editar Link</h3>
                            <button onclick="this.closest('.fixed').remove()" class="text-muted hover:text-ocean transition">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        <form id="editLinkForm" class="space-y-4">
                            <div>
                                <label class="section-label block mb-2">Título</label>
                                <input type="text" id="edit_title" value="${safeTitulo}" class="aero-input" required>
                            </div>
                            <div>
                                <label class="section-label block mb-2">URL</label>
                                <input type="url" id="edit_url" value="${safeUrl}" class="aero-input" required>
                            </div>
                            <div>
                                <label class="section-label block mb-2">Ícone Padrão</label>
                                <select id="edit_icon" class="aero-select">
                                    <option value="">-- Sem ícone padrão --</option>
                                    ${json_encode($icones_disponiveis)}
                                </select>
                            </div>
                            <div>
                                <label class="section-label block mb-2">Ou imagem customizada</label>
                                <input type="file" id="${fileInputId}" accept="image/*" class="hidden">
                                <button type="button" class="edit-custom-icon-btn w-full aero-input text-left py-2 flex items-center justify-between hover:bg-blue-50 transition cursor-pointer" data-input-id="${fileInputId}">
                                    <span class="edit-custom-icon-label text-muted">Clique para selecionar imagem</span>
                                    <i class="fa-solid fa-image text-xs text-ocean"></i>
                                </button>
                                <div id="edit-custom-icon-preview-${fileInputId}" class="mt-3 hidden flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <img class="edit-preview-img w-12 h-12 object-contain rounded border border-blue-200" src="">
                                    <div class="flex-1 min-w-0">
                                        <p class="edit-preview-name text-xs font-bold text-ocean truncate">Imagem carregada</p>
                                        <button type="button" class="edit-remove-custom-icon text-xs text-red-500 hover:text-red-700 hover:underline" data-input-id="${fileInputId}">Remover</button>
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-3 pt-4">
                                <button type="button" onclick="this.closest('.fixed').remove()" class="btn-ghost flex-1">
                                    Cancelar
                                </button>
                                <button type="submit" class="btn-green flex-1">
                                    <i class="fa-solid fa-save mr-2"></i> Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Variável para armazenar ícone customizado na edição
            let editCustomIconDataUrl = null;
            
            // Setup do upload de ícone customizado
            const fileInput = document.getElementById(fileInputId);
            const btn = modal.querySelector('.edit-custom-icon-btn');
            const removeBtn = modal.querySelector('.edit-remove-custom-icon');
            const previewDiv = document.getElementById(`edit-custom-icon-preview-${fileInputId}`);
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                fileInput.click();
            });
            
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                if (!file.type.startsWith('image/')) {
                    showToast('❌ Selecione um arquivo de imagem', 'error');
                    return;
                }
                
                if (file.size > 2 * 1024 * 1024) {
                    showToast('❌ Imagem muito grande (máx 2MB)', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    editCustomIconDataUrl = event.target.result;
                    
                    modal.querySelector('.edit-preview-img').src = editCustomIconDataUrl;
                    modal.querySelector('.edit-preview-name').textContent = file.name;
                    previewDiv.classList.remove('hidden');
                    
                    // Deselecionar ícone padrão
                    document.getElementById('edit_icon').value = '';
                };
                reader.readAsDataURL(file);
            });
            
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                editCustomIconDataUrl = null;
                fileInput.value = '';
                previewDiv.classList.add('hidden');
            });
            
            // Handle form submission
            document.getElementById('editLinkForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const novoTitulo = document.getElementById('edit_title').value.trim();
                const novaUrl = document.getElementById('edit_url').value.trim();
                const novoIcone = document.getElementById('edit_icon').value;
                
                if (!novoTitulo || !novaUrl) {
                    showToast('❌ Preencha título e URL!', 'error');
                    return;
                }
                
                if (!novoIcone && !editCustomIconDataUrl) {
                    showToast('❌ Selecione um ícone ou carregue uma imagem!', 'error');
                    return;
                }
                
                // 🚨 VALIDAÇÕES em tempo real
                if (validarURLDuplicada(novaUrl, id)) {
                    showToast('🔗 Esta URL já está em uso!', 'error');
                    return;
                }

                if (novoIcone && validarIconeDuplicado(novoIcone, id)) {
                    showToast('🎨 Este ícone já está sendo usado!', 'error');
                    return;
                }
                
                // Criar FormData
                const formData = new FormData();
                formData.append('id', id);
                formData.append('titulo', novoTitulo);
                formData.append('url', novaUrl);
                formData.append('icone', novoIcone);
                if (editCustomIconDataUrl) {
                    formData.append('icon_blob', editCustomIconDataUrl);
                }
                
                // Mostrar loading
                const submitBtn = e.target.querySelector('button[type="submit"]');
                const originalHTML = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Salvando...';
                submitBtn.disabled = true;
                
                // Enviar requisição
                fetch('../ajax/editar_link.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        showToast('❌ ' + data.erro, 'error');
                    } else {
                        // Atualizar o card na interface
                        if (linkCard.querySelector('h4')) linkCard.querySelector('h4').textContent = novoTitulo;
                        if (linkCard.querySelector('p')) linkCard.querySelector('p').textContent = novaUrl;
                        
                        // Atualizar LINKS_ATUAIS
                        const linkNoArray = LINKS_ATUAIS.find(l => l.id == id);
                        if (linkNoArray) {
                            linkNoArray.titulo = novoTitulo;
                            linkNoArray.url = novaUrl;
                            linkNoArray.icone = novoIcone;
                            linkNoArray.icon_blob = editCustomIconDataUrl || null;
                            linkNoArray.is_custom_icon = editCustomIconDataUrl ? 1 : 0;
                        }
                        
                        // Atualizar ícone na interface - CORRIGIDO
                        const iconBubble = linkCard.querySelector('.icon-bubble');
                        if (editCustomIconDataUrl) {
                            // Usar ícone customizado
                            iconBubble.innerHTML = `<img src="${editCustomIconDataUrl}" alt="${novoTitulo}" class="custom-icon-img" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" onerror="this.outerHTML='<i class=\"fa-solid fa-link text-ocean-light text-lg\"></i>'">`;
                        } else if (novoIcone) {
                            // Usar ícone padrão
                            const iconPath = `${assetsUrl}/icons/8-bit/${novoIcone}.png`;
                            iconBubble.innerHTML = `<img src="${iconPath}" alt="${novoTitulo}" class="default-icon-img" style="width:100%; height:100%; object-fit:contain;" onerror="this.outerHTML='<i class=\"fa-solid fa-link text-ocean-light text-lg\"></i>'">`;
                        }
                        
                        showToast('✅ Link atualizado com sucesso!', 'success');
                        modal.remove();
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    showToast('❌ Erro ao conectar com o servidor', 'error');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                });
            });
        }

        // Função para excluir link
        function deleteLink(id) {
            console.log('deleteLink chamado com ID:', id);
            if (!confirm('⚠️ Tem certeza que deseja excluir este link?')) {
                return;
            }
            
            // Encontrar o card do link usando data-id
            const linkCard = document.querySelector(`.link-card[data-id="${id}"]`);
            
            if (!linkCard) {
                console.error('Link card não encontrado no DOM para ID:', id);
                alert('❌ Erro ao encontrar o link na página');
                return;
            }
            
            const titulo = linkCard.querySelector('h4')?.textContent || 'Link';
            console.log('linkCard encontrado:', {titulo, id, linkCard});
            
            // Criar FormData
            const formData = new FormData();
            formData.append('id', id);
            
            // Encontrar o botão delete dentro do card
            const btn = linkCard.querySelector('.btn-red');
            if (!btn) {
                console.error('Botão delete não encontrado no card');
                alert('❌ Erro ao encontrar o botão de deleção');
                return;
            }
            
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
            btn.disabled = true;
            
            // Adicionar animação de fade out
            if (linkCard) {
                linkCard.style.transition = 'all 0.3s ease';
                linkCard.style.opacity = '0.5';
                linkCard.style.transform = 'scale(0.95)';
            }
            
            // Enviar requisição
            console.log('Enviando fetch excluir link para ID', id);
            fetch('../ajax/excluir_link.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log('Resposta parcial deleteLink', response);
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status + ' ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('deleteLink retorno json', data);
                if (data.erro) {
                    alert('❌ Erro: ' + data.erro);
                    // Reverter animação se erro
                    if (linkCard) {
                        linkCard.style.opacity = '1';
                        linkCard.style.transform = 'scale(1)';
                    }
                } else {
                    // Remover do array LINKS_ATUAIS
                    const index = LINKS_ATUAIS.findIndex(l => l.id == id);
                    if (index > -1) {
                        LINKS_ATUAIS.splice(index, 1);
                    }
                    
                    // Animação de sucesso e remoção
                    if (linkCard) {
                        linkCard.style.transition = 'all 0.5s ease';
                        linkCard.style.opacity = '0';
                        linkCard.style.transform = 'scale(0.8) translateX(-20px)';
                        setTimeout(() => {
                            linkCard.remove();
                            
                            // Atualizar contador de links
                            const contador = document.getElementById('linksCountTag');
                            if (contador) {
                                const total = document.querySelectorAll('.link-card').length;
                                contador.textContent = total + ' links';
                            }
                            
                            // Mostrar mensagem de sucesso
                            showToast('✅ Link excluído com sucesso!', 'success');
                        }, 500);
                    } else {
                        location.reload();
                    }
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('❌ Erro ao conectar com o servidor');
                // Reverter animação se erro
                if (linkCard) {
                    linkCard.style.opacity = '1';
                    linkCard.style.transform = 'scale(1)';
                }
            })
            .finally(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            });
        }

        // ========== CUSTOM ICON MODE TOGGLE LOGIC ==========
        
        // Safe function to get element with null check
        function safeGetElement(id) {
            const el = document.getElementById(id);
            if (!el) {
                console.warn(`⚠️ Element with ID "${id}" not found`);
            }
            return el;
        }

        // Toggle between predefined and custom icon mode
        function initIconModeToggle() {
            const toggles = document.querySelectorAll('.icon-mode-toggle input[type="radio"]');
            if (toggles.length === 0) return;

            toggles.forEach(toggle => {
                toggle.addEventListener('change', function(e) {
                    const mode = this.value;
                    const predefinedSection = safeGetElement('predefined_icon_section');
                    const customSection = safeGetElement('custom_icon_section');

                    if (!predefinedSection || !customSection) return;

                    if (mode === 'predefined') {
                        // Mostrar ícone predefinido
                        predefinedSection.classList.remove('hidden');
                        customSection.classList.add('hidden');
                        
                        // Limpar imagem customizada
                        const customInput = safeGetElement('custom_icon_input');
                        const preview = safeGetElement('custom_icon_preview');
                        if (customInput) customInput.value = '';
                        if (preview) preview.classList.add('hidden');
                        customIconDataUrl = null;

                    } else if (mode === 'custom') {
                        // Mostrar upload customizado
                        predefinedSection.classList.add('hidden');
                        customSection.classList.remove('hidden');
                        
                        // Limpar ícone predefinido
                        const iconSelect = safeGetElement('link_icon');
                        if (iconSelect) iconSelect.value = '';
                    }
                });
            });
        }

        // ========== GERENCIAMENTO DE ÍCONES CUSTOMIZADOS ==========
        let customIconDataUrl = null;

        // Inicializar toggle
        initIconModeToggle();

        // Upload button: trigger file input com null check
        (function() {
            const btn = safeGetElement('custom_icon_btn');
            const input = safeGetElement('custom_icon_input');
            
            if (btn && input) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    input.click();
                });
            }
        })();

        // File input change handler com null check
        (function() {
            const fileInput = safeGetElement('custom_icon_input');
            if (!fileInput) return;

            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;

                // Validações
                if (!file.type.startsWith('image/')) {
                    showToast('❌ Selecione um arquivo de imagem (PNG, JPG, GIF, WebP)', 'error');
                    return;
                }

                if (file.size > 2 * 1024 * 1024) {
                    showToast('❌ Imagem muito grande. Máximo 2MB', 'error');
                    this.value = '';
                    return;
                }

                // Ler arquivo como data URL
                const reader = new FileReader();
                reader.onload = function(event) {
                    customIconDataUrl = event.target.result;
                    
                    // Atualizar preview - com null checks
                    const preview = safeGetElement('custom_icon_preview');
                    const previewImg = safeGetElement('preview_img');
                    const previewName = safeGetElement('preview_name');
                    
                    if (preview && previewImg && previewName) {
                        previewImg.src = customIconDataUrl;
                        previewName.textContent = file.name;
                        preview.classList.remove('hidden');
                    }

                    showToast('✅ Imagem carregada com sucesso!', 'success');
                };
                reader.onerror = function() {
                    showToast('❌ Erro ao ler arquivo', 'error');
                };
                reader.readAsDataURL(file);
            });
        })();

        // Remove button com null check
        (function() {
            const removeBtn = safeGetElement('remove_custom_icon');
            if (!removeBtn) return;

            removeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                customIconDataUrl = null;
                
                const fileInput = safeGetElement('custom_icon_input');
                const preview = safeGetElement('custom_icon_preview');
                
                if (fileInput) fileInput.value = '';
                if (preview) preview.classList.add('hidden');
                
                showToast('✅ Imagem removida', 'success');
            });
        })();

        // ========== FORM SUBMISSION WITH VALIDATION ==========
        (function() {
            const form = safeGetElement('createLinkForm');
            if (!form) return;

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const titleInput = safeGetElement('link_title');
                const urlInput = safeGetElement('link_url');
                const iconSelect = safeGetElement('link_icon');
                const iconModeRadios = document.querySelectorAll('input[name="icon_mode"]');
                
                if (!titleInput || !urlInput || !iconSelect) return;

                const title = titleInput.value.trim();
                const url = urlInput.value.trim();
                
                // Validações básicas
                if (!title || !url) {
                    showToast('❌ Preencha título e URL!', 'error');
                    return;
                }

                // Get selected mode
                let selectedMode = 'predefined';
                iconModeRadios.forEach(radio => {
                    if (radio.checked) selectedMode = radio.value;
                });

                // Validar baseado no modo
                let icon = '';
                if (selectedMode === 'predefined') {
                    icon = iconSelect.value;
                    if (!icon) {
                        showToast('❌ Selecione um ícone da lista', 'error');
                        return;
                    }
                    if (validarIconeDuplicado(icon)) {
                        showToast('🎨 Este ícone já está sendo usado!', 'error');
                        return;
                    }
                } else if (selectedMode === 'custom') {
                    if (!customIconDataUrl) {
                        showToast('❌ Carregue uma imagem customizada', 'error');
                        return;
                    }
                }
                
                // Validar URL duplicada
                if (validarURLDuplicada(url)) {
                    showToast('🔗 Este link já está cadastrado!', 'error');
                    return;
                }
                
                // Normalizar URL
                let urlFinal = url;
                if (!url.match(/^https?:\/\//)) {
                    urlFinal = 'https://' + url;
                }
                
                // Preparar dados
                const formData = new FormData();
                formData.append('titulo', title);
                formData.append('url', urlFinal);
                formData.append('icone', icon);
                if (customIconDataUrl) {
                    formData.append('icon_blob', customIconDataUrl);
                }
                
                // Loading state
                const btn = this.querySelector('button[type="submit"]');
                const btnText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Adicionando...';
                btn.disabled = true;
                
                // Submit
                fetch('../ajax/adicionar_link.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        showToast('❌ ' + data.erro, 'error');
                    } else {
                        // Limpar form
                        titleInput.value = '';
                        urlInput.value = '';
                        iconSelect.value = '';
                        const fileInput = safeGetElement('custom_icon_input');
                        const preview = safeGetElement('custom_icon_preview');
                        if (fileInput) fileInput.value = '';
                        if (preview) preview.classList.add('hidden');
                        customIconDataUrl = null;
                        
                        // Reset mode toggle
                        const defaultRadio = document.querySelector('input[name="icon_mode"][value="predefined"]');
                        if (defaultRadio) {
                            defaultRadio.checked = true;
                            defaultRadio.dispatchEvent(new Event('change'));
                        }
                        
                        // Atualizar lista
                        if (data.link) {
                            LINKS_ATUAIS.push(data.link);
                        }
                        
                        // Adicionar novo card
                        if (data.link && data.link.id) {
                            const linksContainer = safeGetElement('linksContainer');
                            if (!linksContainer) return;
                            
                            const newCard = document.createElement('div');
                            newCard.className = 'link-card bounce-in';
                            newCard.setAttribute('data-id', data.link.id);
                            
                            // ✅ Gerar HTML do ícone com sanitização correta
                            let iconHTML = '<i class="fa-solid fa-link text-ocean-light text-lg"></i>';
                            
                            // Função para sanitizar atributos HTML
                            function sanitizeAttribute(str) {
                                if (!str) return '';
                                return String(str)
                                    .replace(/&/g, '&amp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/"/g, '&quot;')
                                    .replace(/'/g, '&#39;');
                            }
                            
                            if (data.link.icon_blob && data.link.is_custom_icon === 1) {
                                // Ícone customizado (base64) - não escapa pois é um data URL válido
                                const safeBlobUrl = String(data.link.icon_blob || '').trim();
                                const safeAlt = sanitizeAttribute(title);
                                iconHTML = `<img src="${safeBlobUrl}" alt="${safeAlt}" class="custom-icon-img" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" onerror="this.outerHTML='<i class=\"fa-solid fa-link text-ocean-light text-lg\"></i>'">`;
                            } else if (icon) {
                                // Ícone padrão (8-bit)
                                const iconPath = `${assetsUrl}/icons/8-bit/${icon}.png`;
                                const safeAlt = sanitizeAttribute(title);
                                iconHTML = `<img src="${iconPath}" alt="${safeAlt}" class="default-icon-img" style="width:100%; height:100%; object-fit:contain;" onerror="this.outerHTML='<i class=\"fa-solid fa-link text-ocean-light text-lg\"></i>'">`;
                            }
                            
                            // ✅ Sanitizar valores para evitar caracteres especiais no HTML
                            function escapeHtml(str) {
                                if (!str) return '';
                                return String(str)
                                    .replace(/&/g, '&amp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/"/g, '&quot;')
                                    .replace(/'/g, '&#39;');
                            }
                            
                            const safeTitle = escapeHtml(String(title || ''));
                            const safeUrl = escapeHtml(String(urlFinal || ''));
                            const safeLinkId = parseInt(data.link.id) || 0;
                            
                            // ✅ Construir HTML usando template literal (evita problemas de concatenação)
                            newCard.innerHTML = `
                                <div class="drag-handle" title="Arraste para reordenar">
                                    <i class="fa-solid fa-grip-vertical"></i>
                                </div>
                                <div class="icon-bubble">
                                    ${iconHTML}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-bold text-ocean truncate">${safeTitle}</h4>
                                    <p class="text-muted text-xs truncate mt-0.5">${safeUrl}</p>
                                </div>
                                <div class="flex items-center gap-1.5 flex-shrink-0">
                                    <button class="btn-ghost" onclick="editLink(${safeLinkId}, event)">
                                        <i class="fa-solid fa-pen text-xs"></i>
                                        <span class="hidden md:inline">Editar</span>
                                    </button>
                                    <button class="btn-red" onclick="deleteLink(${safeLinkId})">
                                        <i class="fa-solid fa-trash text-xs"></i>
                                        <span class="hidden md:inline">Excluir</span>
                                    </button>
                                </div>
                            `;
                            
                            // Adicionar
                            const emptyState = linksContainer.querySelector('.empty-state');
                            if (emptyState) emptyState.remove();
                            if (linksContainer.firstChild) {
                                linksContainer.insertBefore(newCard, linksContainer.firstChild);
                            } else {
                                linksContainer.appendChild(newCard);
                            }
                            
                            // Atualizar contador
                            const contador = document.getElementById('linksCountTag');
                            if (contador) {
                                const total = document.querySelectorAll('.link-card').length;
                                contador.textContent = total + ' links';
                            }
                            
                            // Reinicializar sortable
                            initSortable();
                            showToast('✅ Link adicionado com sucesso!', 'success');
                        } else {
                            showToast('✅ ' + data.mensagem, 'success');
                            setTimeout(() => location.reload(), 1000);
                        }
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    showToast('❌ Erro ao conectar com o servidor', 'error');
                })
                .finally(() => {
                    btn.innerHTML = btnText;
                    btn.disabled = false;
                });
            });
        })();

        // ==================== SORTABLE.JS - DRAG AND DROP ====================
        function initSortable() {
            const linksContainer = safeGetElement('linksContainer');
            
            if (!linksContainer) return;
            
            // Destruir sortable anterior se existir
            if (linksContainer.sortableInstance) {
                linksContainer.sortableInstance.destroy();
            }
            
            // Inicializar Sortable
            const sortable = Sortable.create(linksContainer, {
                handle: '.drag-handle',          // Apenas o grip-vertical pode arrastar
                animation: 200,                  // Duração da animação em ms
                ghostClass: 'sortable-ghost',    // Classe durante o arrasto
                dragClass: 'sortable-drag',      // Classe do item sendo arrastado
                chosenClass: 'sortable-chosen',  // Classe quando selecionado
                forceFallback: false,            // Usar HTML5 drag and drop
                easing: 'cubic-bezier(1, 0, 0, 1)', // Easing da animação
                
                onStart: function(evt) {
                    // Feedback visual ao começar arrasto
                    linksContainer.classList.add('sortable-active');
                    document.body.style.cursor = 'grabbing';
                },
                
                onEnd: function(evt) {
                    // Remover feedback visual
                    linksContainer.classList.remove('sortable-active');
                    document.body.style.cursor = 'default';
                    
                    // Atualizar ordem no banco de dados
                    salvarNovaOrdem();
                },
                
                onMove: function(evt) {
                    // Permitir movimento
                    return true;
                }
            });
            
            // Guardar referência para destruição posterior
            linksContainer.sortableInstance = sortable;

            // Add delegated keyboard handling for drag handles
            linksContainer.addEventListener('keydown', function(e) {
                const el = e.target;
                if (!el.classList || !el.classList.contains('drag-handle')) return;
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const card = el.closest('.link-card');
                    if (!card) return;
                    const direction = e.key === 'ArrowUp' ? 'up' : 'down';
                    const moved = moveCardElement(card, direction);
                    if (moved) {
                        card.style.transition = 'transform 0.18s, opacity 0.18s';
                        card.style.transform = 'translateY(' + (direction === 'up' ? '-6px' : '6px') + ')';
                        setTimeout(() => { card.style.transform = ''; }, 180);
                        salvarNovaOrdem();
                        showToast('✅ Link movido ' + (direction === 'up' ? 'para cima' : 'para baixo'), 'success');
                    }
                }
            }, false);
        }

        // Função para salvar nova ordem
        function salvarNovaOrdem() {
            const linksContainer = document.getElementById('linksContainer');
            const links = linksContainer.querySelectorAll('.link-card');
            const ordem = [];
            
            links.forEach((link, index) => {
                const id = link.getAttribute('data-id');
                if (id) {
                    ordem.push({
                        id: id,
                        posicao: index
                    });
                }
            });
            
            if (ordem.length === 0) return;
            
            // Enviar para o servidor
            fetch('../ajax/reordenar_links.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ordem: ordem
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso || data.success) {
                    showToast('✅ Ordem dos links atualizada!', 'success');
                } else {
                    console.warn('Aviso ao salvar ordem:', data);
                }
            })
            .catch(error => {
                console.error('Erro ao reordenar:', error);
                showToast('⚠️ Erro ao salvar ordem dos links', 'error');
            });
        }

        // Move a card element up or down in the DOM (keyboard)
        function moveCardElement(cardEl, direction) {
            if (!cardEl) return false;
            if (direction === 'up') {
                const prev = cardEl.previousElementSibling;
                if (prev) {
                    cardEl.parentNode.insertBefore(cardEl, prev);
                    return true;
                }
            } else if (direction === 'down') {
                const next = cardEl.nextElementSibling;
                if (next) {
                    cardEl.parentNode.insertBefore(next, cardEl);
                    return true;
                }
            }
            return false;
        }

        // ==================== NOME (NICKNAME) ====================
        function openNomeModal() {
            const current = document.getElementById('nomeText').textContent.trim();
            const modal = document.createElement('div');
            modal.id = 'nomeModal';
            modal.innerHTML = `
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div class="modal-dialog rounded-3xl p-6 w-full max-w-md bounce-in">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-ocean"><i class="fa-solid fa-user mr-2"></i>Editar Nome</h3>
                            <button onclick="document.getElementById('nomeModal').remove()" class="text-muted hover:text-ocean transition">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        <input type="text" id="nomeInput" maxlength="60"
                            class="aero-input rounded-2xl"
                            placeholder="Seu nome de exibição..."
                            value="${current === 'Seu nome' ? '' : current}">
                        <div class="flex justify-between items-center mt-1 mb-4">
                            <span class="text-xs text-muted"><span id="nomeCount">${current === 'Seu nome' ? 0 : current.length}</span>/60</span>
                        </div>
                        <div class="flex gap-3">
                            <button onclick="document.getElementById('nomeModal').remove()" class="btn-ghost flex-1">Cancelar</button>
                            <button onclick="saveNome()" class="btn-green flex-1"><i class="fa-solid fa-check mr-2"></i>Salvar</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
            const input = document.getElementById('nomeInput');
            input.addEventListener('input', () => document.getElementById('nomeCount').textContent = input.value.length);
            input.focus();
            input.select();
        }

        function saveNome() {
            const nome = document.getElementById('nomeInput').value.trim();
            
            if (!nome) {
                showToast('❌ O nome não pode estar vazio', 'error');
                return;
            }
            
            if (nome.length > 60) {
                showToast('❌ Nome muito longo (máximo 60 caracteres)', 'error');
                return;
            }
            
            const btn = document.querySelector('#nomeModal .btn-green');
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-1"></i>Salvando...';
            btn.disabled = true;
            
            const fd = new FormData();
            fd.append('nome', nome);
            
            fetch('../ajax/salvar_nome.php', { method: 'POST', body: fd })
                .then(r => r.json())
                .then(data => {
                    if (data.erro) { 
                        showToast('❌ ' + data.erro, 'error'); 
                    } else {
                        document.getElementById('nomeText').textContent = nome;
                        document.getElementById('nomeModal').remove();
                        showToast('✅ Nome atualizado!', 'success');
                    }
                })
                .catch(() => showToast('❌ Erro ao salvar', 'error'))
                .finally(() => { 
                    btn.innerHTML = '<i class="fa-solid fa-check mr-1"></i>Salvar'; 
                    btn.disabled = false; 
                });
        }

        // ==================== BIO ====================
        function openBioModal() {
            const current = document.getElementById('bioText').textContent.trim();
            const modal = document.createElement('div');
            modal.id = 'bioModal';
            modal.innerHTML = `
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div class="modal-dialog rounded-3xl p-6 w-full max-w-md bounce-in">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-ocean"><i class="fa-solid fa-pen mr-2"></i>Editar Bio</h3>
                            <button onclick="document.getElementById('bioModal').remove()" class="text-muted hover:text-ocean transition">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        <textarea id="bioInput" maxlength="160" rows="3"
                            class="aero-input resize-none rounded-2xl"
                            placeholder="Conte algo sobre você...">${current === 'Sem bio ainda' ? '' : current}</textarea>
                        <div class="flex justify-between items-center mt-1 mb-4">
                            <span class="text-xs text-muted"><span id="bioCount">${current === 'Sem bio ainda' ? 0 : current.length}</span>/160</span>
                        </div>
                        <div class="flex gap-3">
                            <button onclick="document.getElementById('bioModal').remove()" class="btn-ghost flex-1">Cancelar</button>
                            <button onclick="saveBio()" class="btn-green flex-1"><i class="fa-solid fa-check mr-1"></i>Salvar</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
            const ta = document.getElementById('bioInput');
            ta.addEventListener('input', () => document.getElementById('bioCount').textContent = ta.value.length);
            ta.focus();
        }

        function saveBio() {
            const bio = document.getElementById('bioInput').value.trim();
            const btn = document.querySelector('#bioModal .btn-green');
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-1"></i>Salvando...';
            btn.disabled = true;
            const fd = new FormData();
            fd.append('bio', bio);
            fetch('../ajax/salvar_bio.php', { method: 'POST', body: fd })
                .then(r => r.json())
                .then(data => {
                    if (data.erro) { showToast('❌ ' + data.erro, 'error'); }
                    else {
                        document.getElementById('bioText').textContent = bio || 'Sem bio ainda';
                        document.getElementById('bioModal').remove();
                        showToast('✅ Bio atualizada!', 'success');
                    }
                })
                .catch(() => showToast('❌ Erro ao salvar', 'error'))
                .finally(() => { btn.innerHTML = '<i class="fa-solid fa-check mr-1"></i>Salvar'; btn.disabled = false; });
        }

        // ==================== INICIALIZAÇÃO ====================
        document.addEventListener('DOMContentLoaded', function() {
            // Inicializar Sortable
            initSortable();
            
            // Adicionar validação em tempo real no formulário de criação
            const linkUrlInput = document.getElementById('link_url');
            const linkIconSelect = document.getElementById('link_icon');
            
            if (linkUrlInput) {
                linkUrlInput.addEventListener('input', () => atualizarValidacaoFormulario('createLinkForm', true));
                linkUrlInput.addEventListener('change', () => atualizarValidacaoFormulario('createLinkForm', true));
            }
            
            if (linkIconSelect) {
                linkIconSelect.addEventListener('change', () => atualizarValidacaoFormulario('createLinkForm', true));
            }
        });
    </script>
</body>
</html>
