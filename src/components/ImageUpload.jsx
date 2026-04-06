import React, { useState, useCallback } from "react";
import { APPS_SCRIPT_URL, APPS_SCRIPT_URL_RIDERS } from "../config";
import AGITO from "../assets/images/heisei/AGITO.svg";
import BLADE from "../assets/images/heisei/BLADE.svg";
import FAIZ from "../assets/images/heisei/FAIZ.svg";
import KUUGA from "../assets/images/heisei/KUUGA.svg";
import RYUKI from "../assets/images/heisei/RYUKI.svg";
import ZERO from "../assets/images/set2/ZERO.svg";
import PHANTOM from "../assets/images/set2/PHANTOM.svg";
import TITAN from "../assets/images/set2/TITAN.svg";
import NOVA from "../assets/images/set2/NOVA.svg";
import SPECTER from "../assets/images/set2/SPECTER.svg";
import HIBIKI from "../assets/images/heisei/HIBIKI.svg";
import KABUTO from "../assets/images/heisei/KABUTO.svg";
import DENO from "../assets/images/heisei/DEN-O.svg";
import KIVA from "../assets/images/heisei/KIVA.svg";
import DECADE from "../assets/images/heisei/DECADE.svg";
import DOUBLE from "../assets/images/heisei/DOUBLE.svg";
import OOO from "../assets/images/heisei/OOO.svg";
import FOURZE from "../assets/images/heisei/FOURZE.svg";
import WIZARD from "../assets/images/heisei/WIZARD.svg";
import GAIM from "../assets/images/heisei/GAIM.svg";
import DRIVE from "../assets/images/heisei/DRIVE.svg";
import GHOST from "../assets/images/heisei/GHOST.svg";
import EXAID from "../assets/images/heisei/EX-AID.svg";
import BUILD from "../assets/images/heisei/BUILD.svg";
import ZIO from "../assets/images/heisei/ZI-O.svg";
import ZEROONE from "../assets/images/reiwa/ZERO-ONE.svg";
import SABER from "../assets/images/reiwa/SABER.svg";
import REVICE from "../assets/images/reiwa/REVICE.svg";
import GEATS from "../assets/images/reiwa/GEATS.svg";
import GOTCHARD from "../assets/images/reiwa/GOTCHARD.svg";
import GAVV from "../assets/images/reiwa/GAVV.svg";
import ZEZTZ from "../assets/images/reiwa/ZEZTZ.svg";
import W_J from "../assets/images/watches/J.png";
import W_ZO from "../assets/images/watches/ZO.png";
import W_accel from "../assets/images/watches/accel.png";
import W_acceltrial from "../assets/images/watches/acceltrial.png";
import W_agito from "../assets/images/watches/agito.png";
import W_agitoshining from "../assets/images/watches/agitoshining.png";
import W_amazon from "../assets/images/watches/amazon.png";
import W_amazonsalpha from "../assets/images/watches/amazonsalpha.png";
import W_amazonsneo from "../assets/images/watches/amazonsneo.png";
import W_amazonsomega from "../assets/images/watches/amazonsomega.png";
import W_anotheragito from "../assets/images/watches/anotheragito.png";
import W_armedhibiki from "../assets/images/watches/armedhibiki.png";
import W_barlckxs from "../assets/images/watches/barlckxs.png";
import W_baron from "../assets/images/watches/baron.png";
import W_beast from "../assets/images/watches/beast.png";
import W_beasthyper from "../assets/images/watches/beasthyper.png";
import W_biorider from "../assets/images/watches/biorider.png";
import W_birth from "../assets/images/watches/birth.png";
import W_black from "../assets/images/watches/black.png";
import W_blackrx from "../assets/images/watches/blackrx.png";
import W_blade from "../assets/images/watches/blade.png";
import W_bladeking from "../assets/images/watches/bladeking.png";
import W_brave from "../assets/images/watches/brave.png";
import W_bravelegacy from "../assets/images/watches/bravelegacy.png";
import W_build from "../assets/images/watches/build.png";
import W_buildgenius from "../assets/images/watches/buildgenius.png";
import W_buildhazard from "../assets/images/watches/buildhazard.png";
import W_buildrabbitdragon from "../assets/images/watches/buildrabbitdragon.png";
import W_buildrabbitrabbit from "../assets/images/watches/buildrabbitrabbit.png";
import W_buildsparkling from "../assets/images/watches/buildsparkling.png";
import W_buildtanktank from "../assets/images/watches/buildtanktank.png";
import W_chalice from "../assets/images/watches/chalice.png";
import W_chaser from "../assets/images/watches/chaser.png";
import W_chasermach from "../assets/images/watches/chasermach.png";
import W_cronus from "../assets/images/watches/cronus.png";
import W_crossz from "../assets/images/watches/crossz.png";
import W_crosszcharge from "../assets/images/watches/crosszcharge.png";
import W_crosszmagma from "../assets/images/watches/crosszmagma.png";
import W_darkkiva from "../assets/images/watches/darkkiva.png";
import W_decade from "../assets/images/watches/decade.png";
import W_decadecomplete from "../assets/images/watches/decadecomplete.png";
import W_decadecomplete21 from "../assets/images/watches/decadecomplete21.png";
import W_decadeviolentemotion from "../assets/images/watches/decadeviolentemotion.png";
import W_deepspecter from "../assets/images/watches/deepspecter.png";
import W_delta from "../assets/images/watches/delta.png";
import W_deno from "../assets/images/watches/deno.png";
import W_denoclimax from "../assets/images/watches/denoclimax.png";
import W_denoliner from "../assets/images/watches/denoliner.png";
import W_diend from "../assets/images/watches/diend.png";
import W_drive from "../assets/images/watches/drive.png";
import W_drivedeadheat from "../assets/images/watches/drivedeadheat.png";
import W_driveformula from "../assets/images/watches/driveformula.png";
import W_drivetridoron from "../assets/images/watches/drivetridoron.png";
import W_eternal from "../assets/images/watches/eternal.png";
import W_evol from "../assets/images/watches/evol.png";
import W_evolblackhole from "../assets/images/watches/evolblackhole.png";
import W_exaid from "../assets/images/watches/exaid.png";
import W_exaidmaximum from "../assets/images/watches/exaidmaximum.png";
import W_exaidmuteki from "../assets/images/watches/exaidmuteki.png";
import W_exaidxxl from "../assets/images/watches/exaidxxl.png";
import W_exaidxxr from "../assets/images/watches/exaidxxr.png";
import W_faiz from "../assets/images/watches/faiz.png";
import W_faizaxel from "../assets/images/watches/faizaxel.png";
import W_faizblaster from "../assets/images/watches/faizblaster.png";
import W_fourze from "../assets/images/watches/fourze.png";
import W_fourzecosmic from "../assets/images/watches/fourzecosmic.png";
import W_g3x from "../assets/images/watches/g3x.png";
import W_gaim from "../assets/images/watches/gaim.png";
import W_gaimjimberlemon from "../assets/images/watches/gaimjimberlemon.png";
import W_gaimkachidoki from "../assets/images/watches/gaimkachidoki.png";
import W_gaimkiwami from "../assets/images/watches/gaimkiwami.png";
import W_garren from "../assets/images/watches/garren.png";
import W_gatack from "../assets/images/watches/gatack.png";
import W_gavv from "../assets/images/watches/gavv.png";
import W_geats from "../assets/images/watches/geats.png";
import W_geiz from "../assets/images/watches/geiz.png";
import W_geizmajesty from "../assets/images/watches/geizmajesty.png";
import W_geizrevive from "../assets/images/watches/geizrevive.png";
import W_genm from "../assets/images/watches/genm.png";
import W_genmzombie from "../assets/images/watches/genmzombie.png";
import W_ghost from "../assets/images/watches/ghost.png";
import W_ghostgrateful from "../assets/images/watches/ghostgrateful.png";
import W_ghostmugen from "../assets/images/watches/ghostmugen.png";
import W_ghosttouconboost from "../assets/images/watches/ghosttouconboost.png";
import W_gills from "../assets/images/watches/gills.png";
import W_gotchard from "../assets/images/watches/gotchard.png";
import W_grandzio from "../assets/images/watches/grandzio.png";
import W_grease from "../assets/images/watches/grease.png";
import W_greaseblizzard from "../assets/images/watches/greaseblizzard.png";
import W_hibiki from "../assets/images/watches/hibiki.png";
import W_hyperkabuto from "../assets/images/watches/hyperkabuto.png";
import W_ibuki from "../assets/images/watches/ibuki.png";
import W_ichigou from "../assets/images/watches/ichigou.png";
import W_ixa from "../assets/images/watches/ixa.png";
import W_joker from "../assets/images/watches/joker.png";
import W_kabuto from "../assets/images/watches/kabuto.png";
import W_kaixa from "../assets/images/watches/kaixa.png";
import W_kikai from "../assets/images/watches/kikai.png";
import W_kiva from "../assets/images/watches/kiva.png";
import W_kivaemperor from "../assets/images/watches/kivaemperor.png";
import W_knight from "../assets/images/watches/knight.png";
import W_knightsurvive from "../assets/images/watches/knightsurvive.png";
import W_kuuga from "../assets/images/watches/kuuga.png";
import W_kuugaamazingmighty from "../assets/images/watches/kuugaamazingmighty.png";
import W_kuugaultimate from "../assets/images/watches/kuugaultimate.png";
import W_lazer from "../assets/images/watches/lazer.png";
import W_mach from "../assets/images/watches/mach.png";
import W_madrogue from "../assets/images/watches/madrogue.png";
import W_meteor from "../assets/images/watches/meteor.png";
import W_meteorstorm from "../assets/images/watches/meteorstorm.png";
import W_necrom from "../assets/images/watches/necrom.png";
import W_nigou from "../assets/images/watches/nigou.png";
import W_ooo from "../assets/images/watches/ooo.png";
import W_oooputotyra from "../assets/images/watches/oooputotyra.png";
import W_oootajador from "../assets/images/watches/oootajador.png";
import W_ouja from "../assets/images/watches/ouja.png";
import W_oumazio from "../assets/images/watches/oumazio.png";
import W_paradx from "../assets/images/watches/paradx.png";
import W_poppy from "../assets/images/watches/poppy.png";
import W_quiz from "../assets/images/watches/quiz.png";
import W_revi from "../assets/images/watches/revi.png";
import W_riderman from "../assets/images/watches/riderman.png";
import W_roborider from "../assets/images/watches/roborider.png";
import W_rogue from "../assets/images/watches/rogue.png";
import W_ryugen from "../assets/images/watches/ryugen.png";
import W_ryuki from "../assets/images/watches/ryuki.png";
import W_ryukisurvive from "../assets/images/watches/ryukisurvive.png";
import W_saber from "../assets/images/watches/saber.png";
import W_scissors from "../assets/images/watches/scissors.png";
import W_shadowmoon from "../assets/images/watches/shadowmoon.png";
import W_shin from "../assets/images/watches/shin.png";
import W_shinobi from "../assets/images/watches/shinobi.png";
import W_skull from "../assets/images/watches/skull.png";
import W_skyrider from "../assets/images/watches/skyrider.png";
import W_snipe from "../assets/images/watches/snipe.png";
import W_snipesimulation from "../assets/images/watches/snipesimulation.png";
import W_specter from "../assets/images/watches/specter.png";
import W_stronger from "../assets/images/watches/stronger.png";
import W_super1 from "../assets/images/watches/super1.png";
import W_tsukuyomi from "../assets/images/watches/tsukuyomi.png";
import W_v3 from "../assets/images/watches/v3.png";
import W_vice from "../assets/images/watches/vice.png";
import W_w from "../assets/images/watches/w.png";
import W_wcjx from "../assets/images/watches/wcjx.png";
import W_wfangjoker from "../assets/images/watches/wfangjoker.png";
import W_wizard from "../assets/images/watches/wizard.png";
import W_wizardalldragon from "../assets/images/watches/wizardalldragon.png";
import W_wizardinfinity from "../assets/images/watches/wizardinfinity.png";
import W_woz from "../assets/images/watches/woz.png";
import W_wozginga from "../assets/images/watches/wozginga.png";
import W_wozwatch from "../assets/images/watches/wozwatch.png";
import W_x from "../assets/images/watches/x.png";
import W_zamonas from "../assets/images/watches/zamonas.png";
import W_zangetsu from "../assets/images/watches/zangetsu.png";
import W_zangetsukachidoki from "../assets/images/watches/zangetsukachidoki.png";
import W_zeronos from "../assets/images/watches/zeronos.png";
import W_zeroone from "../assets/images/watches/zeroone.png";
import W_zeztz from "../assets/images/watches/zeztz.png";
import W_zio from "../assets/images/watches/zio.png";
import W_zioii from "../assets/images/watches/zioii.png";
import W_ziotrinity from "../assets/images/watches/ziotrinity.png";
import W_zolda from "../assets/images/watches/zolda.png";
import W_zonjis from "../assets/images/watches/zonjis.png";
import W_zx from "../assets/images/watches/zx.png";


// Built-in demo set 4 — Ridewatch images (168 watches from Zi-O)
const DEMO_IMAGES_4 = [
  { id: "w_j",                  name: "J",                     src: W_J                  },
  { id: "w_zo",                 name: "ZO",                    src: W_ZO                 },
  { id: "w_accel",              name: "Accel",                 src: W_accel              },
  { id: "w_acceltrial",         name: "Accel Trial",           src: W_acceltrial         },
  { id: "w_agito",              name: "Agito",                 src: W_agito              },
  { id: "w_agitoshining",       name: "Agito Shining",         src: W_agitoshining       },
  { id: "w_amazon",             name: "Amazon",                src: W_amazon             },
  { id: "w_amazonsalpha",       name: "Amazons Alpha",         src: W_amazonsalpha       },
  { id: "w_amazonsneo",         name: "Amazons Neo",           src: W_amazonsneo         },
  { id: "w_amazonsomega",       name: "Amazons Omega",         src: W_amazonsomega       },
  { id: "w_anotheragito",       name: "Another Agito",         src: W_anotheragito       },
  { id: "w_armedhibiki",        name: "Armed Hibiki",          src: W_armedhibiki        },
  { id: "w_barlckxs",           name: "Barlckxs",              src: W_barlckxs           },
  { id: "w_baron",              name: "Baron",                 src: W_baron              },
  { id: "w_beast",              name: "Beast",                 src: W_beast              },
  { id: "w_beasthyper",         name: "Beast Hyper",           src: W_beasthyper         },
  { id: "w_biorider",           name: "Bio Rider",             src: W_biorider           },
  { id: "w_birth",              name: "Birth",                 src: W_birth              },
  { id: "w_black",              name: "Black",                 src: W_black              },
  { id: "w_blackrx",            name: "Black RX",              src: W_blackrx            },
  { id: "w_blade",              name: "Blade",                 src: W_blade              },
  { id: "w_bladeking",          name: "Blade King",            src: W_bladeking          },
  { id: "w_brave",              name: "Brave",                 src: W_brave              },
  { id: "w_bravelegacy",        name: "Brave Legacy",          src: W_bravelegacy        },
  { id: "w_build",              name: "Build",                 src: W_build              },
  { id: "w_buildgenius",        name: "Build Genius",          src: W_buildgenius        },
  { id: "w_buildhazard",        name: "Build Hazard",          src: W_buildhazard        },
  { id: "w_buildrabbitdragon",  name: "Build Rabbit Dragon",   src: W_buildrabbitdragon  },
  { id: "w_buildrabbitrabbit",  name: "Build Rabbit Rabbit",   src: W_buildrabbitrabbit  },
  { id: "w_buildsparkling",     name: "Build Sparkling",       src: W_buildsparkling     },
  { id: "w_buildtanktank",      name: "Build Tank Tank",       src: W_buildtanktank      },
  { id: "w_chalice",            name: "Chalice",               src: W_chalice            },
  { id: "w_chaser",             name: "Chaser",                src: W_chaser             },
  { id: "w_chasermach",         name: "Chaser Mach",           src: W_chasermach         },
  { id: "w_cronus",             name: "Cronus",                src: W_cronus             },
  { id: "w_crossz",             name: "Cross-Z",               src: W_crossz             },
  { id: "w_crosszcharge",       name: "Cross-Z Charge",        src: W_crosszcharge       },
  { id: "w_crosszmagma",        name: "Cross-Z Magma",         src: W_crosszmagma        },
  { id: "w_darkkiva",           name: "Dark Kiva",             src: W_darkkiva           },
  { id: "w_decade",             name: "Decade",                src: W_decade             },
  { id: "w_decadecomplete",     name: "Decade Complete",       src: W_decadecomplete     },
  { id: "w_decadecomplete21",   name: "Decade Complete 21",    src: W_decadecomplete21   },
  { id: "w_decadeviolent",      name: "Decade Violent Emotion",src: W_decadeviolentemotion},
  { id: "w_deepspecter",        name: "Deep Specter",          src: W_deepspecter        },
  { id: "w_delta",              name: "Delta",                 src: W_delta              },
  { id: "w_deno",               name: "Den-O",                 src: W_deno               },
  { id: "w_denoclimax",         name: "Den-O Climax",          src: W_denoclimax         },
  { id: "w_denoliner",          name: "Den-O Liner",           src: W_denoliner          },
  { id: "w_diend",              name: "Diend",                 src: W_diend              },
  { id: "w_drive",              name: "Drive",                 src: W_drive              },
  { id: "w_drivedeadheat",      name: "Drive Dead Heat",       src: W_drivedeadheat      },
  { id: "w_driveformula",       name: "Drive Formula",         src: W_driveformula       },
  { id: "w_drivetridoron",      name: "Drive Tridoron",        src: W_drivetridoron      },
  { id: "w_eternal",            name: "Eternal",               src: W_eternal            },
  { id: "w_evol",               name: "Evol",                  src: W_evol               },
  { id: "w_evolblackhole",      name: "Evol Black Hole",       src: W_evolblackhole      },
  { id: "w_exaid",              name: "Ex-Aid",                src: W_exaid              },
  { id: "w_exaidmaximum",       name: "Ex-Aid Maximum",        src: W_exaidmaximum       },
  { id: "w_exaidmuteki",        name: "Ex-Aid Muteki",         src: W_exaidmuteki        },
  { id: "w_exaidxxl",           name: "Ex-Aid XX L",           src: W_exaidxxl           },
  { id: "w_exaidxxr",           name: "Ex-Aid XX R",           src: W_exaidxxr           },
  { id: "w_faiz",               name: "Faiz",                  src: W_faiz               },
  { id: "w_faizaxel",           name: "Faiz Axel",             src: W_faizaxel           },
  { id: "w_faizblaster",        name: "Faiz Blaster",          src: W_faizblaster        },
  { id: "w_fourze",             name: "Fourze",                src: W_fourze             },
  { id: "w_fourzecosmic",       name: "Fourze Cosmic",         src: W_fourzecosmic       },
  { id: "w_g3x",                name: "G3-X",                  src: W_g3x                },
  { id: "w_gaim",               name: "Gaim",                  src: W_gaim               },
  { id: "w_gaimjimberlemon",    name: "Gaim Jimber Lemon",     src: W_gaimjimberlemon    },
  { id: "w_gaimkachidoki",      name: "Gaim Kachidoki",        src: W_gaimkachidoki      },
  { id: "w_gaimkiwami",         name: "Gaim Kiwami",           src: W_gaimkiwami         },
  { id: "w_garren",             name: "Garren",                src: W_garren             },
  { id: "w_gatack",             name: "Gatack",                src: W_gatack             },
  { id: "w_gavv",               name: "Gavv",                  src: W_gavv               },
  { id: "w_geats",              name: "Geats",                 src: W_geats              },
  { id: "w_geiz",               name: "Geiz",                  src: W_geiz               },
  { id: "w_geizmajesty",        name: "Geiz Majesty",          src: W_geizmajesty        },
  { id: "w_geizrevive",         name: "Geiz Revive",           src: W_geizrevive         },
  { id: "w_genm",               name: "Genm",                  src: W_genm               },
  { id: "w_genmzombie",         name: "Genm Zombie",           src: W_genmzombie         },
  { id: "w_ghost",              name: "Ghost",                 src: W_ghost              },
  { id: "w_ghostgrateful",      name: "Ghost Grateful",        src: W_ghostgrateful      },
  { id: "w_ghostmugen",         name: "Ghost Mugen",           src: W_ghostmugen         },
  { id: "w_ghosttouconboost",   name: "Ghost Toucon Boost",    src: W_ghosttouconboost   },
  { id: "w_gills",              name: "Gills",                 src: W_gills              },
  { id: "w_gotchard",           name: "Gotchard",              src: W_gotchard           },
  { id: "w_grandzio",           name: "Grand Zio",             src: W_grandzio           },
  { id: "w_grease",             name: "Grease",                src: W_grease             },
  { id: "w_greaseblizzard",     name: "Grease Blizzard",       src: W_greaseblizzard     },
  { id: "w_hibiki",             name: "Hibiki",                src: W_hibiki             },
  { id: "w_hyperkabuto",        name: "Hyper Kabuto",          src: W_hyperkabuto        },
  { id: "w_ibuki",              name: "Ibuki",                 src: W_ibuki              },
  { id: "w_ichigou",            name: "Ichigou",               src: W_ichigou            },
  { id: "w_ixa",                name: "IXA",                   src: W_ixa                },
  { id: "w_joker",              name: "Joker",                 src: W_joker              },
  { id: "w_kabuto",             name: "Kabuto",                src: W_kabuto             },
  { id: "w_kaixa",              name: "Kaixa",                 src: W_kaixa              },
  { id: "w_kikai",              name: "Kikai",                 src: W_kikai              },
  { id: "w_kiva",               name: "Kiva",                  src: W_kiva               },
  { id: "w_kivaemperor",        name: "Kiva Emperor",          src: W_kivaemperor        },
  { id: "w_knight",             name: "Knight",                src: W_knight             },
  { id: "w_knightsurvive",      name: "Knight Survive",        src: W_knightsurvive      },
  { id: "w_kuuga",              name: "Kuuga",                 src: W_kuuga              },
  { id: "w_kuugaamazingmighty", name: "Kuuga Amazing Mighty",  src: W_kuugaamazingmighty },
  { id: "w_kuugaultimate",      name: "Kuuga Ultimate",        src: W_kuugaultimate      },
  { id: "w_lazer",              name: "Lazer",                 src: W_lazer              },
  { id: "w_mach",               name: "Mach",                  src: W_mach               },
  { id: "w_madrogue",           name: "Mad Rogue",             src: W_madrogue           },
  { id: "w_meteor",             name: "Meteor",                src: W_meteor             },
  { id: "w_meteorstorm",        name: "Meteor Storm",          src: W_meteorstorm        },
  { id: "w_necrom",             name: "Necrom",                src: W_necrom             },
  { id: "w_nigou",              name: "Nigou",                 src: W_nigou              },
  { id: "w_ooo",                name: "OOO",                   src: W_ooo                },
  { id: "w_oooputotyra",        name: "OOO Putotyra",          src: W_oooputotyra        },
  { id: "w_oootajador",         name: "OOO Tajador",           src: W_oootajador         },
  { id: "w_ouja",               name: "Ouja",                  src: W_ouja               },
  { id: "w_oumazio",            name: "Ouma Zio",              src: W_oumazio            },
  { id: "w_paradx",             name: "Para-DX",               src: W_paradx             },
  { id: "w_poppy",              name: "Poppy",                 src: W_poppy              },
  { id: "w_quiz",               name: "Quiz",                  src: W_quiz               },
  { id: "w_revi",               name: "Revi",                  src: W_revi               },
  { id: "w_riderman",           name: "Riderman",              src: W_riderman           },
  { id: "w_roborider",          name: "Robo Rider",            src: W_roborider          },
  { id: "w_rogue",              name: "Rogue",                 src: W_rogue              },
  { id: "w_ryugen",             name: "Ryugen",                src: W_ryugen             },
  { id: "w_ryuki",              name: "Ryuki",                 src: W_ryuki              },
  { id: "w_ryukisurvive",       name: "Ryuki Survive",         src: W_ryukisurvive       },
  { id: "w_saber",              name: "Saber",                 src: W_saber              },
  { id: "w_scissors",           name: "Scissors",              src: W_scissors           },
  { id: "w_shadowmoon",         name: "Shadow Moon",           src: W_shadowmoon         },
  { id: "w_shin",               name: "Shin",                  src: W_shin               },
  { id: "w_shinobi",            name: "Shinobi",               src: W_shinobi            },
  { id: "w_skull",              name: "Skull",                 src: W_skull              },
  { id: "w_skyrider",           name: "Skyrider",              src: W_skyrider           },
  { id: "w_snipe",              name: "Snipe",                 src: W_snipe              },
  { id: "w_snipesimulation",    name: "Snipe Simulation",      src: W_snipesimulation    },
  { id: "w_specter",            name: "Specter",               src: W_specter            },
  { id: "w_stronger",           name: "Stronger",              src: W_stronger           },
  { id: "w_super1",             name: "Super-1",               src: W_super1             },
  { id: "w_tsukuyomi",          name: "Tsukuyomi",             src: W_tsukuyomi          },
  { id: "w_v3",                 name: "V3",                    src: W_v3                 },
  { id: "w_vice",               name: "Vice",                  src: W_vice               },
  { id: "w_w",                  name: "W",                     src: W_w                  },
  { id: "w_wcjx",               name: "W CJX",                 src: W_wcjx               },
  { id: "w_wfangjoker",         name: "W Fang Joker",          src: W_wfangjoker         },
  { id: "w_wizard",             name: "Wizard",                src: W_wizard             },
  { id: "w_wizardalldragon",    name: "Wizard All Dragon",     src: W_wizardalldragon    },
  { id: "w_wizardinfinity",     name: "Wizard Infinity",       src: W_wizardinfinity     },
  { id: "w_woz",                name: "Woz",                   src: W_woz                },
  { id: "w_wozginga",           name: "Woz Ginga",             src: W_wozginga           },
  { id: "w_wozwatch",           name: "Woz Watch",             src: W_wozwatch           },
  { id: "w_x",                  name: "X",                     src: W_x                  },
  { id: "w_zamonas",            name: "Zamonas",               src: W_zamonas            },
  { id: "w_zangetsu",           name: "Zangetsu",              src: W_zangetsu           },
  { id: "w_zangetsukachidoki",  name: "Zangetsu Kachidoki",    src: W_zangetsukachidoki  },
  { id: "w_zeronos",            name: "Zeronos",               src: W_zeronos            },
  { id: "w_zeroone",            name: "Zero-One",              src: W_zeroone            },
  { id: "w_zeztz",              name: "Zeztz",                 src: W_zeztz              },
  { id: "w_zio",                name: "Zio",                   src: W_zio                },
  { id: "w_zioii",              name: "Zio II",                src: W_zioii              },
  { id: "w_ziotrinity",         name: "Zio Trinity",           src: W_ziotrinity         },
  { id: "w_zolda",              name: "Zolda",                 src: W_zolda              },
  { id: "w_zonjis",             name: "Zonjis",                src: W_zonjis             },
  { id: "w_zx",                 name: "ZX",                    src: W_zx                 },
];

// Built-in demo set 3 — all Heisei and Reiwa Kamen Riders
const DEMO_IMAGES_3 = [
  { id: "demo_kuuga",   name: "KUUGA",   src: KUUGA   },
  { id: "demo_agito",   name: "AGITO",   src: AGITO   },
  { id: "demo_ryuki",   name: "RYUKI",   src: RYUKI   },
  { id: "demo_faiz",    name: "FAIZ",    src: FAIZ    },
  { id: "demo_blade",   name: "BLADE",   src: BLADE   },
  { id: "demo_hibiki",  name: "HIBIKI",  src: HIBIKI  },
  { id: "demo_kabuto",  name: "KABUTO",  src: KABUTO  },
  { id: "demo_deno",    name: "DEN-O",   src: DENO    },
  { id: "demo_kiva",    name: "KIVA",    src: KIVA    },
  { id: "demo_decade",  name: "DECADE",  src: DECADE  },
  { id: "demo_double",  name: "DOUBLE",  src: DOUBLE  },
  { id: "demo_ooo",     name: "OOO",     src: OOO     },
  { id: "demo_fourze",  name: "FOURZE",  src: FOURZE  },
  { id: "demo_wizard",  name: "WIZARD",  src: WIZARD  },
  { id: "demo_gaim",    name: "GAIM",    src: GAIM    },
  { id: "demo_drive",   name: "DRIVE",   src: DRIVE   },
  { id: "demo_ghost",   name: "GHOST",   src: GHOST   },
  { id: "demo_exaid",   name: "EX-AID",  src: EXAID   },
  { id: "demo_build",   name: "BUILD",   src: BUILD   },
  { id: "demo_zio",     name: "ZI-O",    src: ZIO     },
  { id: "demo_zeroone", name: "ZERO-ONE", src: ZEROONE},
  { id: "demo_saber",   name: "SABER",   src: SABER   },
  { id: "demo_revice",  name: "REVICE",  src: REVICE  },
  { id: "demo_geats",   name: "GEATS",   src: GEATS   },
  { id: "demo_gotchard",name: "GOTCHARD",src: GOTCHARD},
  { id: "demo_gavv",    name: "GAVV",    src: GAVV    },
  { id: "demo_zeztz",   name: "ZEZTZ",   src: ZEZTZ   },
];

// Built-in demo set 2 — Unit fighters
const DEMO_IMAGES_2 = [
  { id: "demo_zero", name: "ZERO", src: ZERO },
  { id: "demo_phantom", name: "PHANTOM", src: PHANTOM },
  { id: "demo_titan", name: "TITAN", src: TITAN },
  { id: "demo_nova", name: "NOVA", src: NOVA },
  { id: "demo_specter", name: "SPECTER", src: SPECTER },
];

// Lets the user build their image set before starting the ranking session.
// Accepts a FileList (from the file picker or drag-and-drop), reads each file
// as a base64 data URL, and appends it to the preview grid.
// Parses an exported JSON rankings file ({ rank, name, image }[]) into the
// internal format ({ id, name, src }[]) sorted by rank.
function parseJSONRankings(text) {
  const data = JSON.parse(text);
  if (!data || data._source !== "RiderRanker") {
    throw new Error("This file wasn't exported from RiderRanker.");
  }
  if (!Array.isArray(data.rankings)) throw new Error("Invalid rankings format.");
  return data.rankings
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map((item, i) => ({
      id: `imported_${i}`,
      name: item.name || `Item ${i + 1}`,
      src: item.image || "",
    }));
}

// Parses an exported CSV rankings file (Rank,Name header + rows) into the
// internal format ({ id, name, src }[]) sorted by rank.
function parseCSVRankings(text) {
  const lines = text.trim().split("\n").slice(1); // skip header
  return lines
    .map((line, i) => {
      const comma = line.indexOf(",");
      const rank = parseInt(line.slice(0, comma), 10);
      const name = line.slice(comma + 1).replace(/^"|"$/g, "");
      return { rank, name, id: `imported_${i}`, src: "" };
    })
    .sort((a, b) => a.rank - b.rank);
}

export default function ImageUpload({ onImagesSelected, onRankingsLoaded, hasSavedSession, onResume }) {
  const [previews, setPreviews] = useState([]);
  const [demoStatsUrl, setDemoStatsUrl] = useState(null);

  // Filters a FileList down to image files, reads each one asynchronously
  // with FileReader, and appends the resolved objects to the previews array.
  const loadFiles = useCallback((files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    const readers = imageFiles.map((file, i) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({
          id: `img_${Date.now()}_${i}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          src: e.target.result,
        });
        reader.readAsDataURL(file);
      })
    );
    setDemoStatsUrl(null);
    Promise.all(readers).then(images =>
      setPreviews(prev => [...prev, ...images])
    );
  }, []);

  // Handles the drop event on the drop-zone div; extracts the dropped files
  // and passes them to loadFiles.
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    loadFiles(e.dataTransfer.files);
  }, [loadFiles]);

  // Removes a single image from the preview list by its id.
  const removeImage = (id) => setPreviews(prev => prev.filter(img => img.id !== id));

  // Reads a dropped or selected JSON/CSV rankings file and passes the parsed
  // list directly to onRankingsLoaded, skipping the battle phase entirely.
  const handleRankingsFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const rankings = file.name.endsWith(".csv")
          ? parseCSVRankings(text)
          : parseJSONRankings(text);
        onRankingsLoaded(rankings);
      } catch (err) {
        alert("Could not parse rankings file: " + err.message);
      }
    };
    reader.readAsText(file);
  }, [onRankingsLoaded]);

  const n = previews.length;
  const battleCount = Math.round(n * (n - 1) / 2);
  // Merge sort needs only O(n log n) comparisons rather than the full O(n²) exhaustive count
  const estimatedComparisons = n < 2 ? 0
    : Math.round(n * Math.ceil(Math.log2(Math.max(n, 2))));

  return (
    <div className="upload-container">
      <h1>Image Ranker</h1>
      <p className="upload-subtitle">Upload images to rank them through head-to-head battles</p>

      {/* Image upload disabled
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("file-input").click()}
      >
        <div className="drop-zone-icon">+</div>
        <p>Drop images here or click to select</p>
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => loadFiles(e.target.files)}
        />
      </div>
      */}

      {hasSavedSession && (
        <div className="resume-banner">
          <span>You have a saved session.</span>
          <button className="resume-btn" onClick={onResume}>Resume</button>
        </div>
      )}

      <div className="import-rankings-row">
        <label className="import-rankings-label">
          View saved rankings:
          <input
            type="file"
            accept=".json,.csv"
            style={{ display: "none" }}
            onChange={(e) => { if (e.target.files[0]) handleRankingsFile(e.target.files[0]); }}
          />
          <span className="import-rankings-btn">Import JSON / CSV</span>
        </label>
      </div>

      <div className="demo-btn-row">
        {/* <button className="demo-btn" onClick={() => setPreviews(DEMO_IMAGES_2)}>
          Demo: Unit Fighters
        </button> */}
        <button className="demo-btn" onClick={() => { setPreviews(DEMO_IMAGES_3); setDemoStatsUrl(APPS_SCRIPT_URL_RIDERS); }}>
          Demo: Heisei &amp; Reiwa Riders
        </button>
        <button className="demo-btn" onClick={() => { setPreviews(DEMO_IMAGES_4); setDemoStatsUrl(APPS_SCRIPT_URL); }}>
          Demo: Ridewatches
        </button>
      </div>

      {previews.length > 0 && (
        <>
          <div className="preview-grid">
            {previews.map(img => (
              <div key={img.id} className="preview-item">
                <img src={img.src} alt={img.name} />
                <span className="preview-name">{img.name}</span>
                <button className="remove-btn" onClick={() => removeImage(img.id)}>×</button>
              </div>
            ))}
          </div>

          <p className="battle-count">
            {n} images &mdash; ~{estimatedComparisons} comparisons (vs {battleCount} exhaustive)
          </p>

          <button
            className="start-btn"
            onClick={() => onImagesSelected(previews, demoStatsUrl)}
            disabled={previews.length < 2}
          >
            Start Ranking
          </button>
        </>
      )}
    </div>
  );
}
