"use client";

import Image from "next/image";
import { Monitor, Smartphone } from "lucide-react";

interface LinkItem {
  title: string;
  icon: string;
  url: string;
}

const profileLinks: LinkItem[] = [
  { title: "Portfólio", icon: "/imgs/icons/Google Chrome.png", url: "https://main-portfolio-sigma-flame.vercel.app/" },
  { title: "Twitter", icon: "/imgs/icons/Twitter.png", url: "https://x.com/ct_cafe87877" },
  { title: "LinkedIn", icon: "/imgs/icons/LinkedIn.png", url: "https://www.linkedin.com/in/gabriel-felipe-sabino-de-souza-ab05a630a/" },
  { title: "GitHub", icon: "/imgs/icons/github.png", url: "https://github.com/CAFE2l" },
  { title: "YouTube", icon: "/imgs/icons/Youtube.png", url: "https://www.youtube.com/@CAFE_ct" },
  { title: "Pinterest", icon: "/imgs/icons/Pinterest.png", url: "https://br.pinterest.com/abbass11king11duolingo/" },
  { title: "Telegram", icon: "/imgs/icons/Telegram.png", url: "https://t.me/cafect2l" },
  { title: "Discord", icon: "/imgs/icons/Discord.png", url: "https://discord.com/invite/gW2tShPFxf" },
];

const allIconFiles = [
  "AirBnB.png","Air_Europa.png","Amazon.png","Amazon_Prime.png","Amazon_Shopping.png","ArtStation.png","ARZone.png","Authy.png","Battle.png","Booking.png",
  "CityMapper.png","Cuenta_DNI.png","Deliveroo.png","Deviantart.png","Discord.png","Duolingo.png","Evernote.png","Express_VPN.png","Facebook_Messenger.png","Facebook.png",
  "Firefox.png","FitBod.png","folder.png","Galaxy_Store.png","github.png","Glovo.png","Gmail.png","Google_Authentificator_Old.png","Google_Authentificator.png","Google_Calendar.png",
  "Google_Chrome.png","Google_Currents.png","Google_Docs.png","Google_Drive.png","Google_Files.png","Google_Fit.png","Google_Forms.png","Google_Hangouts.png","Google_Keep.png","Google_Launcher.png",
  "Google_Maps_Old.png","Google_Maps.png","Google_Photos.png","Google_Playstore.png","Google.png","Google_Podcasts.png","Google_Sheets.png","Google_Slides.png","Google_TalkBack.png","Google_Text_to_Speech.png",
  "Google_Translate.png","Google_TV.png","Google_Wallet.png","icon(1).png","Idealista.png","Instagram_Old.png","Instagram.png","Itch_io.png","Ko_Fi.png","Letterboxd.png",
  "LinkedIn.png","linkwave.png","Lloyds_Bank.png","London_Guide.png","London_Offline_Map.png","London_Tube_Map.png","Mercadolibre.png","Mercadopago.png","Mi_Argentina.png","Microsoft_Access.png",
  "Microsoft_Authentificator.png","Microsoft_Edge.png","Microsoft_Excel.png","Microsoft_Launcher.png","Microsoft_Link_to_Windows.png","Microsoft_Office.png","Microsoft_OneDrive.png","Microsoft_OneNote.png","Microsoft_PowerPoint.png","Microsoft_Publisher.png",
  "Microsoft_To_Do.png","Microsoft_Word.png","Miro.png","Moj.png","My_Fitness_Pal.png","Netflix.png","Netflix_v2.png","Notion.png","Nova_Launcher.png","Nuffield_Health.png",
  "Opera.png","Outlook.png","Patreon.png","PayPal.png","PedidosYa.png","Pikmin.png","Pinterest.png","Reddit.png","Rubiks_Cube.png","Safari.png",
  "Samsung_Free.png","Santander.png","Skype.png","Slack.png","Slack_v2.png","Snapchat.png","SocioPlus.png","SoundCloud.png","Spareroom.png","Spotify.png",
  "Steam.png","store.png","Tarjeta_Transporte_Madrid.png","Telegram.png","Terraria.png","Tfl_Go.png","Tfl_Oyster.png","TickTick.png","TikTok.png","Tinder.png",
  "Todoist.png","Toggl_Blue_Icon.png","Toggl_Hire.png","Toggl_Plan.png","Toggl.png","Toggl_Track.png","Trello.png","Trello_v2.png","Tumblr.png","Twitch.png",
  "Twitter.png","Uber_Eats.png","Uber.png","Vitality_GP.png","Vitality.png","Vivaldi.png","Vodafone.png","Whatsapp.png","Wikipedia.png","WinRAR.png","Youtube.png","Zoom.png",
];

function CosmicProfileDesktop() {
  return (
    <div className="cosmic-preview-desktop">
      <div className="cosmic-preview-nebula" />
      <div className="cosmic-preview-stars" />

      <div className="dimensional-banner">
        <Image
          src="/imgs/banners/linkwave.png"
          alt="Banner"
          width={600}
          height={200}
          className="w-full h-full object-cover"
        />
        <div className="banner-overlay" />
      </div>

      <div className="cosmic-avatar-border">
        <Image
          src="/imgs/essentials/profile.jpg"
          alt="Avatar"
          width={80}
          height={80}
          className="cosmic-avatar-img"
        />
      </div>

      <h3 className="cosmic-preview-name">Gabriel Felipe</h3>
      <p className="cosmic-preview-bio">Full-Stack Developer · Digital Influencer · Web 3 Enthusiast</p>

      <div className="cosmic-preview-links">
        {profileLinks.map((link) => (
          <a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="quantum-link-item"
          >
            <Image src={link.icon} alt="" width={20} height={20} className="link-icon" />
            <span>{link.title}</span>
          </a>
        ))}
      </div>

      <div className="cosmic-preview-footer">
        <span className="text-blue-300 mr-1">✦</span>
        LinkWave — sua página de links
      </div>
    </div>
  );
}

function CosmicProfileMobile() {
  return (
    <div className="cosmic-preview-mobile">
      <div className="cosmic-preview-nebula" />
      <div className="cosmic-preview-stars" />

      <div className="cosmic-mobile-banner">
        <Image
          src="/imgs/banners/linkwave.png"
          alt="Banner"
          width={280}
          height={100}
          className="w-full h-full object-cover"
        />
        <div className="banner-overlay" />
      </div>

      <div className="cosmic-mobile-avatar-border">
        <Image
          src="/imgs/essentials/profile.jpg"
          alt="Avatar"
          width={44}
          height={44}
          className="cosmic-avatar-img"
        />
      </div>

      <div className="cosmic-mobile-name">Gabriel Felipe</div>
      <div className="cosmic-mobile-bio">Full-Stack Developer</div>

      <div className="cosmic-mobile-links">
        {profileLinks.map((link) => (
          <a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="quantum-link-item-mobile"
          >
            <Image src={link.icon} alt="" width={14} height={14} className="link-icon" />
            <span>{link.title}</span>
          </a>
        ))}
      </div>

      <div className="cosmic-mobile-footer">✦ LinkWave</div>
    </div>
  );
}

export function Showcase() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28" id="showcase">
      <div className="text-center mb-14">
        <span className="glass-tag">Preview</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl text-ocean">
          Veja como sua página fica
        </h2>
        <p className="mt-3 text-base text-muted max-w-md mx-auto">
          Uma experiência premium em qualquer tela.
        </p>
      </div>

      <div className="grid md:grid-cols-7 gap-8 items-start">
        {/* Desktop Preview */}
        <div className="md:col-span-4">
          <div className="glass-card-strong p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Monitor size={15} className="text-ocean-light" />
              <span className="text-xs font-bold text-ocean-light uppercase tracking-wider">Desktop</span>
            </div>
            <div className="flex justify-center py-4">
              <div className="monitor-container">
                <div className="monitor-glow-bg" />
                <div className="monitor-tilt">
                  <div className="monitor-body">
                    <div className="monitor-screen">
                      <CosmicProfileDesktop />
                    </div>
                    <Image
                      src="/imgs/essentials/monitor.png"
                      alt="Monitor"
                      width={358}
                      height={296}
                      className="monitor-frame"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview */}
        <div className="md:col-span-3 flex justify-center md:justify-start">
          <div className="glass-card-strong p-4 md:p-5 w-full">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone size={15} className="text-ocean-light" />
              <span className="text-xs font-bold text-ocean-light uppercase tracking-wider">Mobile</span>
            </div>
            <div className="flex justify-center py-4">
              <div className="phone-container-sm">
                <div className="phone-glow-bg-sm" />
                <div className="phone-tilt-sm">
                  <div className="phone-body-sm">
                    <div className="phone-screen-sm">
                      <CosmicProfileMobile />
                    </div>
                    <Image
                      src="/imgs/essentials/frame.png"
                      alt="Phone"
                      width={500}
                      height={938}
                      className="phone-frame-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Icon Library */}
      <div className="mt-16">
        <div className="glass-card-strong p-5 md:p-7">
          <div className="text-center mb-8">
            <h3 className="text-xl font-black text-ocean tracking-tight">
              Biblioteca de ícones
            </h3>
            <p className="text-sm text-muted mt-1">
              Todos os {allIconFiles.length} ícones disponíveis no LinkWave
            </p>
          </div>
          <div className="icon-grid">
            {allIconFiles.map((file) => (
              <div key={file} className="icon-grid-item">
                <Image
                  src={`/imgs/icons/${file}`}
                  alt={file.replace(".png", "")}
                  width={32}
                  height={32}
                  className="icon-grid-img"
                />
                <span className="icon-grid-label">{file.replace(".png", "")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
