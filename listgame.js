(function() {
  const GITHUB_RAW_LIST = [
    { 
      name: "Grand Theft Auto Advance", 
      url: "https://github.com/vungnho/Retro-player-plugin/blob/main/Grand%20Theft%20Auto%20Advance%20(USA).gba", 
      core: "gba" 
    },
    { 
      name: "Pokemon - Emerald Version", 
      url: "https://github.com/vungnho/Retro-player-plugin/blob/main/Pokemon%20-%20Emerald%20Version%20(USA%2C%20Europe).gba", 
      core: "gba" 
    },
    { 
      name: "Legend of Zelda, The - The Minish Cap", 
      url: "https://github.com/vungnho/Retro-player-plugin/blob/main/Legend%20of%20Zelda%2C%20The%20-%20The%20Minish%20Cap%20(USA).gba", 
      core: "gba" 
    },
    { 
      name: "Pokemon - FireRed Version", 
      url: "https://github.com/vungnho/Retro-player-plugin/blob/main/Pokemon%20-%20FireRed%20Version%20(USA%2C%20Europe)%20(Rev%201).gba", 
      core: "gba" 
    },
    { 
      name: "Pokemon Ultra Violet", 
      url: "https://github.com/vungnho/Retro-player-plugin/blob/main/Pokemon%20Ultra%20Violet%20(1.22)%20LSA%20(Fire%20Red%20Hack).gba", 
      core: "gba" 
    }
  ];

  const OTHER_GAMES = [
    { name: "Jackal (Jeep)", url: "Jackal (USA).nes", core: "nes" },
    { name: "1200-in-1 (J)", url: "1200-in-1 (J) [p1].nes", core: "nes" },
    { name: "Guerrilla War", url: "Guerrilla War (USA).nes", core: "nes" },
    { name: "Super Mario Bros. 3", url: "Super Mario Bros. 3 (USA) (Rev 1).nes", core: "nes" },
    { name: "Yu-Gi-Oh! - Dungeon Dice Monsters", url: "https://cdn.jsdelivr.net/gh/vungnho/Retro-player-plugin@main/Yu-Gi-Oh!%20-%20Dungeon%20Dice%20Monsters%20(USA)%20(En%2CEs).gba", core: "gba" }
  ];

  const convertToCDN = (url) => {
    if (typeof url === 'string' && url.includes("github.com")) {
      return url
        .replace("github.com", "cdn.jsdelivr.net/gh")
        .replace("/blob/", "@")
        .replace("/raw/", "@");
    }
    return url;
  };

  window.RETRO_GAME_LIBRARY = [
    ...GITHUB_RAW_LIST.map(g => ({ ...g, url: convertToCDN(g.url) })),
    ...OTHER_GAMES
  ];
})();
