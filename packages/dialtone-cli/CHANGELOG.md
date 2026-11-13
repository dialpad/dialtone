# [1.9.0](https://github.com/dialpad/dialtone/compare/dialtone-cli/v1.8.0...dialtone-cli/v1.9.0) (2026-11-13)


### Bug Fixes

* **Cli:** DLT-3739 remove scratch docs and correct result labels ([#1543](https://github.com/dialpad/dialtone/issues/1543)) ([608a255](https://github.com/dialpad/dialtone/commit/608a2550b0f0a4473dea8be74d2d85e1558578b7))
* **Filter Pill:** DLT-3735 fix custom content mounting and localize summaries ([#1541](https://github.com/dialpad/dialtone/issues/1541)) ([47f9ec2](https://github.com/dialpad/dialtone/commit/47f9ec2e208da3cbf793bb557c57e40e7b4ce37d))


### Documentation

* **Action Language:** NO-JIRA fix typos and examples that break the page's own rules ([#1547](https://github.com/dialpad/dialtone/issues/1547)) ([880af47](https://github.com/dialpad/dialtone/commit/880af47fb87911c9eca36d860ae194e994af83ee))


### Features

* **Dropdown,popover,list Item:** DLT-3738 add menu choices and logical visibility ([#1542](https://github.com/dialpad/dialtone/issues/1542)) ([8492354](https://github.com/dialpad/dialtone/commit/84923549d4a37ea1239a38dab33b98193379f995))
* **Filter Pill:** DLT-3736 add controlled selection ([#1577](https://github.com/dialpad/dialtone/issues/1577)) ([73afd3b](https://github.com/dialpad/dialtone/commit/73afd3b6a510d412ee04c0c74171af2f1121e025))

# [1.8.0](https://github.com/dialpad/dialtone/compare/dialtone-cli/v1.7.0...dialtone-cli/v1.8.0) (2026-11-10)


### Bug Fixes

* **Avatar,badge,modal:** DLT-3568 re-evaluate slot presence reactively ([#1519](https://github.com/dialpad/dialtone/issues/1519)) ([6e732fe](https://github.com/dialpad/dialtone/commit/6e732feab5402f291d2479bc7516c9ebcf2ca5ee))
* **Combinator:** DLT-3669 correct split-button and text-list presets ([#1516](https://github.com/dialpad/dialtone/issues/1516)) ([815d9e9](https://github.com/dialpad/dialtone/commit/815d9e9c765bce529d2ee5170bdacf3628352815))
* **Combinator:** DLT-3721 modernize preset APIs ([#1533](https://github.com/dialpad/dialtone/issues/1533)) ([e82f7c5](https://github.com/dialpad/dialtone/commit/e82f7c53fb711dec675bb2b875ceec25379eba87))
* **Combinator:** DLT-3731 preserve default-slot copy scope ([#1532](https://github.com/dialpad/dialtone/issues/1532)) ([f3ee537](https://github.com/dialpad/dialtone/commit/f3ee537a64583f8a7dc8769bf25878d368668e0d))
* **Dialtone Cli:** DLT-3717 show prop deprecation notices ([#1511](https://github.com/dialpad/dialtone/issues/1511)) ([5326cda](https://github.com/dialpad/dialtone/commit/5326cda7bea61e3120584117399d847b2fd0260d))
* **Dialtone Css:** DLT-3718 retain grouped public utility selectors ([#1513](https://github.com/dialpad/dialtone/issues/1513)) ([a1246d5](https://github.com/dialpad/dialtone/commit/a1246d5f4845f5011adbf79ce3743c2149bc6327))
* **Dialtone Css:** DLT-3723 show slider marks in Safari without overflow-clip-margin ([#1521](https://github.com/dialpad/dialtone/issues/1521)) ([f44f1f5](https://github.com/dialpad/dialtone/commit/f44f1f55235b1a020d8b7466f7140717c574ff60))
* **Dropdown,combinator:** DLT-3719 correct anchor bindings and presets ([#1514](https://github.com/dialpad/dialtone/issues/1514)) ([abb11d5](https://github.com/dialpad/dialtone/commit/abb11d54c96a8d500ad8391bbcd19d5fcc19c039))
* **Loader:** DLT-3729 name loaders for assistive technology ([#1530](https://github.com/dialpad/dialtone/issues/1530)) ([2cdaee5](https://github.com/dialpad/dialtone/commit/2cdaee5cac514a2fc47d2b00eed9b9f5c0c4c09f))
* **Storybook:** DLT-3730 correct composed demo labels and list markup ([#1531](https://github.com/dialpad/dialtone/issues/1531)) ([d1501be](https://github.com/dialpad/dialtone/commit/d1501be101d4e961aa55fce629aaef8a9dff427e))
* **Vue,combinator:** DLT-3669 document supported preset APIs ([#1517](https://github.com/dialpad/dialtone/issues/1517)) ([1d764e6](https://github.com/dialpad/dialtone/commit/1d764e6870eb638c9dd1b1d61f0c576cd5f80423))


### Code Refactoring

* **Dialtone Tokens:** NO-JIRA stop syncing the unrestricted variable collection ([#1526](https://github.com/dialpad/dialtone/issues/1526)) ([9702d20](https://github.com/dialpad/dialtone/commit/9702d20f7613e24e8f8389f89e2f5ab975e9eacd))


### Documentation

* **Dialtone Documentation:** DLT-3733 update authored examples to current APIs ([#1536](https://github.com/dialpad/dialtone/issues/1536)) ([cdb82fa](https://github.com/dialpad/dialtone/commit/cdb82fae6c85c531e78c0d22b2342bb5d42fbf33))
* **Input:** DLT-3716 correct validation message type ([#1510](https://github.com/dialpad/dialtone/issues/1510)) ([c5d6716](https://github.com/dialpad/dialtone/commit/c5d67168eea0f6825a3f4e7dd390b4d67eced4b2))
* **Modal:** DLT-3720 correct backdrop dismissal guidance ([#1512](https://github.com/dialpad/dialtone/issues/1512)) ([456bb5f](https://github.com/dialpad/dialtone/commit/456bb5f1b2fc4599c6323b6e44ac1c24ef419a17))
* **Storybook:** DLT-3725 correct accessibility examples ([#1529](https://github.com/dialpad/dialtone/issues/1529)) ([2359ca5](https://github.com/dialpad/dialtone/commit/2359ca5421b53a4e18cd9c62688ec92978192ed9))


### Features

* **Migration:** DLT-3516 convert Text kind and size to variant ([#1539](https://github.com/dialpad/dialtone/issues/1539)) ([11b76f9](https://github.com/dialpad/dialtone/commit/11b76f95401735cf96735498543df35b5df260df))

# [1.7.0](https://github.com/dialpad/dialtone/compare/dialtone-cli/v1.6.0...dialtone-cli/v1.7.0) (2026-11-03)


### Bug Fixes

* **Cli,mcp:** DLT-3708 link update notices to installation guidance ([#1503](https://github.com/dialpad/dialtone/issues/1503)) ([8eb270a](https://github.com/dialpad/dialtone/commit/8eb270aee38bb4cd9ee3ebc948a0a629f7a1e0fa))
* **Dialtone Cli, Dialtone Mcp Server:** DLT-3670 release bundled data when its sources change ([#1474](https://github.com/dialpad/dialtone/issues/1474)) ([3a9e0bc](https://github.com/dialpad/dialtone/commit/3a9e0bcd4d1e2831c2f8357675593cbda909fe26))
* **Dialtone Docs:** DLT-3692 preserve usage recommendation labels ([#1494](https://github.com/dialpad/dialtone/issues/1494)) ([a5736c4](https://github.com/dialpad/dialtone/commit/a5736c4d88ccdaa4631afcac96176bdce54e4d7b))
* **Dialtone Tokens:** DLT-3682 flatten alpha-modified colours whose target is translucent ([#1489](https://github.com/dialpad/dialtone/issues/1489)) ([c82fb4a](https://github.com/dialpad/dialtone/commit/c82fb4a2649b2bb995e045fc119e0a2f0e3ad061))
* **Dialtone Tokens:** DLT-3697 scope foreground colours for strokes ([#1495](https://github.com/dialpad/dialtone/issues/1495)) ([0222d48](https://github.com/dialpad/dialtone/commit/0222d481b0a2fa0b9e7f6b63bdf12d73d100f298))
* **Docs:** DLT-3669 accept documented native attributes ([#1508](https://github.com/dialpad/dialtone/issues/1508)) ([b628395](https://github.com/dialpad/dialtone/commit/b628395ac0248df5e3670c34d7576b919a83687d))


### Documentation

* **Cli,mcp:** DLT-3709 centralize assistant lookup instructions ([#1509](https://github.com/dialpad/dialtone/issues/1509)) ([fadcaa6](https://github.com/dialpad/dialtone/commit/fadcaa6b59cb3e5fbe597464d7c8a27f5733a2fc))
* **Dialtone Documentation:** DLT-3673 add DtSlider What's New post ([#1501](https://github.com/dialpad/dialtone/issues/1501)) ([d83bccd](https://github.com/dialpad/dialtone/commit/d83bccdd1f6498b9999636093c6fb43441d56f1a))
* **Dialtone Documentation:** NO-JIRA add Figma styles What's New post ([#1497](https://github.com/dialpad/dialtone/issues/1497)) ([2bd2dba](https://github.com/dialpad/dialtone/commit/2bd2dbad6cc7fa07950b78f6195bf6fcc6ca4070))
* **Dialtone Documentation:** NO-JIRA publish Figma variables What's New post ([#1496](https://github.com/dialpad/dialtone/issues/1496)) ([46fc1eb](https://github.com/dialpad/dialtone/commit/46fc1eb28b31b64188b74b48143ba9958ecfa911))
* **Dialtone:** DLT-3695 repair public assistant setup ([#1500](https://github.com/dialpad/dialtone/issues/1500)) ([25e11cb](https://github.com/dialpad/dialtone/commit/25e11cb616e340dae69f61958bf2a69732bedbc4))
* DLT-3662 homepage brand follow-ups ([#1479](https://github.com/dialpad/dialtone/issues/1479)) ([6b1f946](https://github.com/dialpad/dialtone/commit/6b1f94625e0fa59775b574f646e6c4cc5db056cf))


### Features

* **Cli,mcp:** DLT-3711 connect examples to existing documentation ([#1507](https://github.com/dialpad/dialtone/issues/1507)) ([46f1351](https://github.com/dialpad/dialtone/commit/46f13512e786a374a7cce6bb9c1099507fc06e4f))
* **Dialtone Docs:** DLT-3666 extend source example delivery and coverage ([#1491](https://github.com/dialpad/dialtone/issues/1491)) ([f90b20d](https://github.com/dialpad/dialtone/commit/f90b20dfbe055d88124108d702cc75ebb9309cca))
* **Dialtone Docs:** DLT-3667 generate Combinator preset examples from curated sources ([#1493](https://github.com/dialpad/dialtone/issues/1493)) ([6749f8a](https://github.com/dialpad/dialtone/commit/6749f8afed5fea8fce082e513015ed610ae44c74))
* **Dialtone Docs:** DLT-3710 deliver source-driven component examples ([#1505](https://github.com/dialpad/dialtone/issues/1505)) ([945ded7](https://github.com/dialpad/dialtone/commit/945ded7084f2662936669f8bf25330643eb90f32))
* **Loader:** DLT-3619 replace spinner with dot loader ([#1464](https://github.com/dialpad/dialtone/issues/1464)) ([0c46fc6](https://github.com/dialpad/dialtone/commit/0c46fc67f79fd9a881dd4cf98f219edb0ce4ed6e))

# [1.6.0](https://github.com/dialpad/dialtone/compare/dialtone-cli/v1.5.0...dialtone-cli/v1.6.0) (2026-10-27)


### Bug Fixes

* **Dialtone Query Core:** DLT-3672 find components in contextual keyword searches ([#1476](https://github.com/dialpad/dialtone/issues/1476)) ([81bb86d](https://github.com/dialpad/dialtone/commit/81bb86d55312cc5675cd5e9ef95f14cfdb554c7e))


### Features

* **Dialtone Cli, Dialtone Mcp Server:** DLT-2711 retrieve documentation examples with complete setup ([#1473](https://github.com/dialpad/dialtone/issues/1473)) ([f4d6b67](https://github.com/dialpad/dialtone/commit/f4d6b67967ddbe0c811943a9f543fdcc602a35bb))
* **Dialtone Mcp Server:** DLT-3654 resolve installed project data ([#1471](https://github.com/dialpad/dialtone/issues/1471)) ([d098c6b](https://github.com/dialpad/dialtone/commit/d098c6bd2636cf9efaa12cee1a6c51177fc2b2f4))

# [1.5.0](https://github.com/dialpad/dialtone/compare/dialtone-cli/v1.4.0...dialtone-cli/v1.5.0) (2026-10-20)


### Bug Fixes

* **Dialtone Query Core, Dialtone Docs:** DLT-3085 retrieve directive guidance ([#1463](https://github.com/dialpad/dialtone/issues/1463)) ([d28b2f7](https://github.com/dialpad/dialtone/commit/d28b2f70c004937758ebb85070a525d0a4b4c8ef))


### Features

* **Dialtone Query Core:** DLT-3659 share curated discovery keywords ([#1472](https://github.com/dialpad/dialtone/issues/1472)) ([1033549](https://github.com/dialpad/dialtone/commit/1033549e2ec8087fee4adced26c9293d04a02953))

# [1.4.0](https://github.com/dialpad/dialtone/compare/dialtone-cli/v1.3.0...dialtone-cli/v1.4.0) (2026-10-15)


### Bug Fixes

* **Dialtone Query Core:** DLT-3651 align search and migration guidance ([#1461](https://github.com/dialpad/dialtone/issues/1461)) ([84ac078](https://github.com/dialpad/dialtone/commit/84ac078aa8f09fde46fecb9c1bc71e1f275f35dc))


### Features

* **Dialtone Mcp Server:** DLT-3650 add complete API retrieval and provenance ([#1462](https://github.com/dialpad/dialtone/issues/1462)) ([c23dc8c](https://github.com/dialpad/dialtone/commit/c23dc8c3cc4aa99aabf3651a0d024ce7bb935609))

# [1.3.0](https://github.com/dialpad/dialtone/compare/dialtone-cli/v1.2.0...dialtone-cli/v1.3.0) (2026-10-13)


### Bug Fixes

* **Dialtone Mcp Server, Dialtone Cli:** DLT-3655 unblock startup and shared releases ([#1454](https://github.com/dialpad/dialtone/issues/1454)) ([2f72801](https://github.com/dialpad/dialtone/commit/2f728014ed1964152f08d47361dd617383a4e026))
* **Dialtone Mcp Server, Dialtone Query Core:** DLT-3640 correct guidance and version metadata ([#1452](https://github.com/dialpad/dialtone/issues/1452)) ([6dcebc5](https://github.com/dialpad/dialtone/commit/6dcebc5dd6adc2e9b1dbf1c27901dd1bbf27e578))


### Features

* **Dialtone Query Core:** DLT-3649 align public component identity ([#1455](https://github.com/dialpad/dialtone/issues/1455)) ([94d7d56](https://github.com/dialpad/dialtone/commit/94d7d560a53403c22069b5724e213e10087badb8))

# [1.2.0](https://github.com/dialpad/dialtone/compare/dialtone-cli/v1.1.0...dialtone-cli/v1.2.0) (2026-10-06)


### Bug Fixes

* **Dialtone Cli:** DLT-3222 suppress query-core debug output ([#1448](https://github.com/dialpad/dialtone/issues/1448)) ([21c883c](https://github.com/dialpad/dialtone/commit/21c883c5cc154261466f98b9e5c8477cccb4afe4))


### Features

* **Dialtone Cli, Dialtone Query Core:** DLT-3639 select exact component names and use the project's Dialtone data ([#1449](https://github.com/dialpad/dialtone/issues/1449)) ([1c236be](https://github.com/dialpad/dialtone/commit/1c236be653cae4fa0d252f0ff88546621907f9a3))

# [1.1.0](https://github.com/dialpad/dialtone/compare/dialtone-cli/v1.0.0...dialtone-cli/v1.1.0) (2026-09-16)


### Features

* DLT-2979 dialtone version 10 upgrade ([#1426](https://github.com/dialpad/dialtone/issues/1426)) ([21b5032](https://github.com/dialpad/dialtone/commit/21b50328e54a528fc961fc62b27b0460e4f3bf80))

# [1.1.0-next.1](https://github.com/dialpad/dialtone/compare/dialtone-cli/v1.0.0...dialtone-cli/v1.1.0-next.1) (2026-07-03)


### Features

* **Dialtone Vue:** DLT-3225 migrate component size props to numeric ordinal scale ([#1157](https://github.com/dialpad/dialtone/issues/1157)) ([725bd41](https://github.com/dialpad/dialtone/commit/725bd411b842489634c9ba79098144bee166c2da))

# 1.0.0 (2026-06-16)


### Bug Fixes

* **Dialtone Cli:** NO-JIRA wire into release and publish pipelines ([#1321](https://github.com/dialpad/dialtone/issues/1321)) ([84d9c3c](https://github.com/dialpad/dialtone/commit/84d9c3caa6f4f6e1c1eb5258f5e9c7a39ddd518d))
* NO-JIRA make dialtone-cli private ([cf555f2](https://github.com/dialpad/dialtone/commit/cf555f2a0c8562a949ec3c5b28e10185612b441a))


### Features

* **Dialtone Cli,dialtone Query Core:** DLT-3163 extract query core and add CLI ([#1142](https://github.com/dialpad/dialtone/issues/1142)) ([65090e6](https://github.com/dialpad/dialtone/commit/65090e6dc215084677e05fa50eb1ba0de72c61d8))
* **Mcp Server, Query Core, Dialtone Docs, Dialtone Cli:** DLT-3416 add search_documentation tool ([#1259](https://github.com/dialpad/dialtone/issues/1259)) ([ef1d5a8](https://github.com/dialpad/dialtone/commit/ef1d5a897df670200c8a7f0c34ed47c430e3ed35))
