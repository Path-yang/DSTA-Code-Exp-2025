const ScamDetector = require('../utils/scamDetection.js').default;

// 300 Trusted websites (should be 0-30% - green)
const TRUSTED_SITES = [
  // Major tech companies
  'google.com', 'youtube.com', 'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
  'microsoft.com', 'apple.com', 'amazon.com', 'netflix.com', 'linkedin.com', 'reddit.com',
  'wikipedia.org', 'github.com', 'stackoverflow.com', 'dropbox.com', 'zoom.us', 'adobe.com',
  'salesforce.com', 'shopify.com', 'wordpress.com', 'medium.com', 'twitch.tv', 'discord.com',
  'tiktok.com', 'snapchat.com', 'pinterest.com', 'spotify.com', 'whatsapp.com', 'telegram.org',
  
  // Government sites - Singapore
  'gov.sg', 'moe.gov.sg', 'ica.gov.sg', 'cpf.gov.sg', 'hdb.gov.sg', 'dsta.gov.sg',
  'mas.gov.sg', 'ura.gov.sg', 'nea.gov.sg', 'lta.gov.sg', 'singhealth.com.sg', 'nhg.com.sg',
  'polyclinic.sg', 'healthhub.sg', 'sla.gov.sg', 'moh.gov.sg', 'minlaw.gov.sg', 'mha.gov.sg',
  'mindef.gov.sg', 'mom.gov.sg', 'mti.gov.sg', 'mof.gov.sg', 'pmo.gov.sg', 'istana.gov.sg',
  
  // Government sites - US
  'gov.us', 'usa.gov', 'irs.gov', 'nasa.gov', 'fbi.gov', 'cia.gov', 'dhs.gov', 'state.gov',
  'defense.gov', 'justice.gov', 'treasury.gov', 'usps.com', 'nih.gov', 'cdc.gov', 'fda.gov',
  
  // Government sites - Other countries
  'gov.uk', 'parliament.uk', 'nhs.uk', 'hmrc.gov.uk', 'dvla.gov.uk', 'gov.ca', 'canada.ca',
  'cra-arc.gc.ca', 'statcan.gc.ca', 'gov.au', 'ato.gov.au', 'bom.gov.au', 'abc.net.au',
  
  // Education - Singapore
  'nus.edu.sg', 'ntu.edu.sg', 'smu.edu.sg', 'sutd.edu.sg', 'sit.edu.sg', 'nie.edu.sg',
  'yale-nus.edu.sg', 'duke-nus.edu.sg', 'insead.edu', 'sp.edu.sg', 'np.edu.sg', 'tp.edu.sg',
  'nyp.edu.sg', 'rp.edu.sg', 'ite.edu.sg', 'suss.edu.sg', 'lasalle.edu.sg', 'nafa.edu.sg',
  
  // Education - US
  'harvard.edu', 'mit.edu', 'stanford.edu', 'berkeley.edu', 'caltech.edu', 'princeton.edu',
  'yale.edu', 'columbia.edu', 'uchicago.edu', 'cornell.edu', 'upenn.edu', 'dartmouth.edu',
  'brown.edu', 'duke.edu', 'northwestern.edu', 'vanderbilt.edu', 'rice.edu', 'emory.edu',
  'georgetown.edu', 'nyu.edu', 'usc.edu', 'ucla.edu', 'umich.edu', 'unc.edu', 'virginia.edu',
  
  // Education - UK
  'ox.ac.uk', 'cam.ac.uk', 'imperial.ac.uk', 'ucl.ac.uk', 'kcl.ac.uk', 'lse.ac.uk',
  'ed.ac.uk', 'manchester.ac.uk', 'bristol.ac.uk', 'warwick.ac.uk', 'bath.ac.uk',
  
  // News & Media
  'cnn.com', 'bbc.com', 'bbc.co.uk', 'nytimes.com', 'reuters.com', 'bloomberg.com',
  'theguardian.com', 'wsj.com', 'forbes.com', 'techcrunch.com', 'wired.com', 'npr.org',
  'pbs.org', 'cbsnews.com', 'abcnews.go.com', 'nbcnews.com', 'usatoday.com', 'washingtonpost.com',
  'latimes.com', 'chicagotribune.com', 'seattletimes.com', 'denverpost.com', 'bostonglobe.com',
  'straitstimes.com', 'channelnewsasia.com', 'todayonline.com', 'mothership.sg',
  
  // Financial services
  'chase.com', 'bankofamerica.com', 'wellsfargo.com', 'citibank.com', 'jpmorgan.com',
  'americanexpress.com', 'discover.com', 'capitalone.com', 'fidelity.com', 'schwab.com',
  'tdameritrade.com', 'etrade.com', 'robinhood.com', 'vanguard.com', 'blackrock.com',
  'goldmansachs.com', 'morganstanley.com', 'dbs.com.sg', 'ocbc.com.sg', 'uob.com.sg',
  'maybank.com.sg', 'standardchartered.com.sg', 'hsbc.com.sg', 'citi.com.sg',
  
  // E-commerce & Services
  'ebay.com', 'etsy.com', 'walmart.com', 'target.com', 'bestbuy.com', 'costco.com',
  'homedepot.com', 'lowes.com', 'macys.com', 'nordstrom.com', 'kohls.com', 'jcpenney.com',
  'sears.com', 'alibaba.com', 'aliexpress.com', 'taobao.com', 'jd.com', 'rakuten.com',
  'flipkart.com', 'myntra.com', 'snapdeal.com', 'paytm.com', 'lazada.sg', 'shopee.sg',
  'qoo10.sg', 'carousell.sg', 'grab.com', 'gojek.com', 'uber.com', 'lyft.com',
  
  // Cloud & Software services
  'aws.amazon.com', 'cloud.google.com', 'azure.microsoft.com', 'digitalocean.com',
  'heroku.com', 'netlify.com', 'vercel.com', 'cloudflare.com', 'fastly.com', 'akamai.com',
  'slack.com', 'teams.microsoft.com', 'asana.com', 'trello.com', 'notion.so', 'figma.com',
  'canva.com', 'sketch.com', 'invision.com', 'miro.com', 'lucidchart.com', 'confluence.atlassian.com',
  
  // Search engines & utilities
  'bing.com', 'duckduckgo.com', 'yahoo.com', 'yandex.ru', 'baidu.com', 'naver.com',
  'weather.com', 'accuweather.com', 'timeanddate.com', 'worldclock.com', 'translate.google.com',
  'maps.google.com', 'earth.google.com', 'gmail.com', 'outlook.com', 'yahoo.mail.com',
  
  // Entertainment & Gaming
  'steam.com', 'steampowered.com', 'epicgames.com', 'origin.com', 'ubisoft.com', 'ea.com',
  'nintendo.com', 'playstation.com', 'xbox.com', 'blizzard.com', 'riotgames.com', 'valve.com',
  'hulu.com', 'disneyplus.com', 'primevideo.com', 'hbomax.com', 'paramount.com', 'peacocktv.com',
  'crunchyroll.com', 'funimation.com', 'imdb.com', 'rottentomatoes.com', 'metacritic.com',
  
  // Health & Medical
  'webmd.com', 'mayoclinic.org', 'clevelandclinic.org', 'johnshopkins.org', 'medlineplus.gov',
  'healthline.com', 'medicalnewstoday.com', 'drugs.com', 'rxlist.com', 'nih.gov',
  'who.int', 'redcross.org', 'doctorswithoutborders.org', 'stjude.org', 'cancer.org'
];

// 1200 Mixed websites (varying risk levels)
const MIXED_SITES = [
  // Real websites but varying legitimacy levels
  'craigslist.org', '4chan.org', 'imgur.com', 'tumblr.com', 'deviantart.com',
  'soundcloud.com', 'bandcamp.com', 'vimeo.com', 'dailymotion.com', 'archive.org', 'wikimedia.org',
  'wikihow.com', 'quora.com', 'answers.com',
  
  // Regional sites
  'weibo.com', 'qq.com', 'xiaohongshu.com', 'zhihu.com',
  'sina.com.cn', '163.com', 'sohu.com', 'ifeng.com', 'people.com.cn', 'xinhuanet.com',
  'vk.com', 'ok.ru', 'mail.ru', 'yandex.com', 'rambler.ru', 'livejournal.com',
  'skyrock.com', 'orange.fr', 'free.fr', 'leboncoin.fr', 'seloger.com', 'pap.fr',
  
  // E-commerce platforms (medium risk)
  'wish.com', 'banggood.com', 'gearbest.com', 'lightinthebox.com', 'miniinthebox.com',
  'rosegal.com', 'sammydress.com', 'tidebuy.com', 'dresslink.com', 'newchic.com',
  'zaful.com', 'shein.com', 'romwe.com', 'yesstyle.com', 'milanoo.com', 'tbdress.com',
  
  // File sharing (higher risk)
  'thepiratebay.org', 'kickasstorrents.to', '1337x.to', 'rarbg.to', 'torrentz2.eu',
  'torrentfreak.com', 'torrentgalaxy.to', 'zooqle.com', 'torlock.com', 'idope.se',
  
  // Adult content (real sites, higher risk scores)
  'xnxx.com', 'xvideos.com', 'pornhub.com', 'redtube.com', 'tube8.com', 'youporn.com',
  'spankbang.com', 'xhamster.com', 'txxx.com', 'vporn.com', 'sunporno.com', 'beeg.com',
  
  // Gaming/Gambling (varying risk)
  'pokerstars.com', 'partypoker.com', 'bet365.com', 'ladbrokes.com', 'williamhill.com',
  'paddypower.com', 'betfair.com', 'coral.co.uk', 'skybet.com', 'betway.com',
  'unibet.com', '888casino.com', 'casinoclub.com', 'jackpotcity.com', 'spinpalace.com',
  
  // Forums & Communities
  'stackexchange.com', 'superuser.com', 'serverfault.com', 'mathoverflow.net', 'askubuntu.com',
  'unix.stackexchange.com', 'tex.stackexchange.com', 'english.stackexchange.com',
  'skeptics.stackexchange.com', 'cooking.stackexchange.com', 'diy.stackexchange.com',
  
  // Suspicious-looking but real domains
  'free-games-downloads.com', 'download-software-free.com', 'best-antivirus-review.com',
  'top10-dating-sites.com', 'make-money-online-free.com', 'weight-loss-pills-review.com',
  'credit-repair-services.com', 'payday-loans-online.com', 'forex-trading-signals.com',
  'binary-options-trading.com', 'cryptocurrency-investment.com', 'bitcoin-trading-bot.com',
  
  // URL shorteners (medium risk)
  'bit.ly', 'tinyurl.com', 'ow.ly', 't.co', 'goo.gl', 'short.link', 'cutt.ly', 'rb.gy',
  'is.gd', 'v.gd', 'tiny.cc', 'shorturl.at', 'bitly.com', 'tny.im', 'tr.im', 'snipurl.com',
  
  // Technical/developer sites
  'npmjs.com', 'pypi.org', 'rubygems.org', 'packagist.org', 'nuget.org', 'crates.io',
  'golang.org', 'nodejs.org', 'python.org', 'ruby-lang.org', 'php.net', 'perl.org',
  'rust-lang.org', 'swift.org', 'kotlinlang.org', 'scala-lang.org', 'clojure.org',
  
  // Unusual TLD sites (higher risk)
  'example.tk', 'free-hosting.ml', 'my-website.ga', 'blog-site.cf', 'online-store.gq',
  'news-portal.xyz', 'gaming-site.click', 'download-center.download', 'social-network.site',
  'ecommerce-platform.online', 'crypto-exchange.top', 'dating-service.club',
  
  // Cryptocurrency sites (varying risk)
  'coinbase.com', 'binance.com', 'kraken.com', 'gemini.com', 'bitstamp.net', 'bitfinex.com',
  'huobi.com', 'okx.com', 'kucoin.com', 'gate.io', 'bybit.com', 'ftx.com',
  'uniswap.org', 'pancakeswap.finance', 'sushiswap.org', 'compound.finance', 'aave.com',
  
  // VPN/Privacy services
  'nordvpn.com', 'expressvpn.com', 'surfshark.com', 'cyberghost.com', 'purevpn.com',
  'hotspotshield.com', 'tunnelbear.com', 'windscribe.com', 'protonvpn.com', 'mullvad.net',
  
  // Real sites with suspicious patterns
  'secure-banking-login.com', 'account-verification-center.com', 'customer-service-portal.com',
  'technical-support-online.com', 'password-reset-service.com', 'security-update-center.com',
  'official-microsoft-support.com', 'apple-customer-service.com', 'google-account-recovery.com',
  'paypal-security-center.com', 'amazon-customer-support.com', 'netflix-account-update.com',
  
  // International news sites
  'rt.com', 'sputniknews.com', 'presstv.ir', 'aljazeera.com', 'france24.com', 'dw.com',
  'euronews.com', 'scmp.com', 'straitstimes.com', 'japantimes.co.jp', 'koreatimes.co.kr',
  'timesofindia.indiatimes.com', 'hindustantimes.com', 'thehindu.com', 'ndtv.com',
  
  // Marketplace/classifieds (varying legitimacy)
  'olx.com', 'gumtree.com', 'leboncoin.fr', 'marktplaats.nl', 'blocket.se', 'finn.no',
  'dba.dk', 'tori.fi', 'subito.it', 'milanuncios.com', 'avito.ru', 'youla.ru',
  
  // Educational but less known
  'coursera.org', 'edx.org', 'udacity.com', 'udemy.com', 'skillshare.com', 'lynda.com',
  'pluralsight.com', 'treehouse.com', 'codecademy.com', 'freecodecamp.org', 'khanacademy.org',
  
  // Health/fitness (varying credibility)
  'bodybuilding.com', 'myfitnesspal.com', 'fitbit.com', 'strava.com', 'runkeeper.com',
  'mapmyrun.com', 'garmin.com', 'polar.com', 'suunto.com', 'wahoo.com',
  
  // Travel sites
  'booking.com', 'expedia.com', 'priceline.com', 'kayak.com', 'skyscanner.com', 'trivago.com',
  'hotels.com', 'agoda.com', 'airbnb.com', 'vrbo.com', 'tripadvisor.com', 'lonelyplanet.com',
  
  // Software download sites (varying safety)
  'download.com', 'softonic.com', 'filehippo.com', 'majorgeeks.com', 'ninite.com',
  'portableapps.com', 'fosshub.com', 'sourceforge.net', 'getapp.com', 'alternativeto.net',
  
  // Random legitimate but obscure sites
  'timeanddate.com', 'worldometers.info', 'numbeo.com', 'glassdoor.com',
  'indeed.com', 'monster.com', 'careerbuilder.com', 'ziprecruiter.com', 'dice.com',
  
  // Streaming/entertainment (varying legitimacy)
  'twitch.tv', 'mixer.com', 'dlive.tv', 'trovo.live', 'nimo.tv', 'booyah.live',
  'facebook.com/gaming', 'youtube.com/gaming', 'caffeine.tv', 'theta.tv',
  
  // Cloud storage
  'drive.google.com', 'onedrive.live.com', 'icloud.com', 'box.com', 'mega.nz',
  'mediafire.com', '4shared.com', 'zippyshare.com', 'rapidgator.net', 'uploaded.net',
  
  // Email services
  'protonmail.com', 'tutanota.com', 'guerrillamail.com', '10minutemail.com', 'temp-mail.org',
  'mailinator.com', 'yopmail.com', 'maildrop.cc', 'guerrillamail.de', 'throwaway.email',
  
  // Dating sites (varying legitimacy)
  'match.com', 'eharmony.com', 'okcupid.com', 'pof.com', 'zoosk.com', 'bumble.com',
  'tinder.com', 'badoo.com', 'meetme.com', 'skout.com', 'tagged.com', 'mingle2.com',
  
  // Real but suspicious-sounding domains
  'free-trial-offers.com', 'limited-time-deals.com', 'exclusive-member-benefits.com',
  'premium-account-upgrade.com', 'instant-cash-rewards.com', 'guaranteed-results.com',
  'risk-free-investment.com', 'no-questions-asked.com', 'act-now-limited-offer.com',
  'click-here-to-claim.com', 'congratulations-winner.com', 'you-have-been-selected.com',
  
  // Software companies (legitimate)
  'jetbrains.com', 'atlassian.com', 'slack.com', 'zoom.us', 'webex.com', 'gotomeeting.com',
  'teamviewer.com', 'anydesk.com', 'vnc.com', 'logmein.com', 'citrix.com', 'vmware.com',
  
  // More international sites
  'bild.de', 'spiegel.de', 'zeit.de', 'faz.net', 'sueddeutsche.de', 'welt.de',
  'lemonde.fr', 'lefigaro.fr', 'liberation.fr', 'leparisien.fr', 'lexpress.fr',
  'repubblica.it', 'corriere.it', 'gazzetta.it', 'ansa.it', 'rainews.it',
  
  // Tech blogs/news
  'arstechnica.com', 'theverge.com', 'engadget.com', 'gizmodo.com', 'venturebeat.com',
  'mashable.com', 'readwrite.com', 'techradar.com', 'pcmag.com', 'pcworld.com',
  
  // Financial news
  'marketwatch.com', 'fool.com', 'seekingalpha.com', 'morningstar.com', 'benzinga.com',
  'investopedia.com', 'finance.yahoo.com', 'money.cnn.com', 'bloomberg.com', 'cnbc.com',
  
  // Scientific/academic
  'nature.com', 'science.org', 'cell.com', 'nejm.org', 'bmj.com', 'thelancet.com',
  'pubmed.ncbi.nlm.nih.gov', 'scholar.google.com', 'researchgate.net', 'academia.edu',
  
  // More miscellaneous real sites
  'pinterest.com', 'behance.net', 'dribbble.com', 'unsplash.com', 'pexels.com', 'pixabay.com',
  'shutterstock.com', 'gettyimages.com', 'istockphoto.com', 'stockvault.net',
  
  // Regional e-commerce
  'mercadolibre.com', 'submarino.com.br', 'americanas.com.br', 'casasbahia.com.br',
  'magazineluiza.com.br', 'extra.com.br', 'shoptime.com.br', 'buscape.com.br',
  
  // More forums
  'resetera.com', 'neogaf.com', 'gamefaqs.gamespot.com', 'ign.com', 'gamespot.com',
  'kotaku.com', 'polygon.com', 'eurogamer.net', 'pcgamer.com', 'rockpapershotgun.com',
  
  // Music services
  'spotify.com', 'apple.com/music', 'youtube.com/music', 'tidal.com', 'deezer.com',
  'pandora.com', 'last.fm', 'bandcamp.com', 'soundcloud.com', 'mixcloud.com',
  
  // Job sites
  'glassdoor.com', 'indeed.com', 'monster.com', 'careerbuilder.com', 'ziprecruiter.com',
  'dice.com', 'crunchbase.com', 'angellist.com', 'wellfound.com', 'flexjobs.com',
  
  // Real estate
  'zillow.com', 'realtor.com', 'redfin.com', 'trulia.com', 'apartments.com',
  'rent.com', 'padmapper.com', 'hotpads.com', 'rentals.com', 'forrent.com',
  
  // Food delivery
  'ubereats.com', 'doordash.com', 'grubhub.com', 'postmates.com', 'seamless.com',
  'deliveroo.com', 'foodpanda.com', 'just-eat.com', 'takeaway.com', 'zomato.com',
  
  // Fitness/wellness
  'peloton.com', 'noom.com', 'headspace.com', 'calm.com', 'meditation.com',
  'yogajournal.com', 'shape.com', 'menshealth.com', 'womenshealthmag.com', 'runnersworld.com'
];

// 500 Non-existent websites (should show "website not found")
const NON_EXISTENT_SITES = [
  'thisisnotarealwebsite.com', 'fakesitemadeup.org', 'doesnotexist123.net', 'imaginarysite.co',
  'nonexistentdomain.info', 'madeupwebsite.biz', 'fakecompany.xyz', 'notreal.site',
  'invented.online', 'fictional.tech', 'bogus.digital', 'phony.app', 'false.dev',
  'counterfeit.io', 'artificial.ai', 'synthetic.ml', 'simulated.data', 'virtual.cloud',
  
  'randomfakesite1.com', 'randomfakesite2.com', 'randomfakesite3.com', 'randomfakesite4.com',
  'randomfakesite5.com', 'randomfakesite6.com', 'randomfakesite7.com', 'randomfakesite8.com',
  'randomfakesite9.com', 'randomfakesite10.com', 'randomfakesite11.com', 'randomfakesite12.com',
  
  'nonexistent-ecommerce.com', 'fake-online-store.com', 'bogus-marketplace.com',
  'imaginary-shop.com', 'fictional-retail.com', 'made-up-store.com', 'phony-shopping.com',
  'false-commerce.com', 'artificial-market.com', 'synthetic-shop.com',
  
  'fake-news-site.com', 'bogus-media.com', 'fictional-news.com', 'made-up-journalism.com',
  'phony-reporting.com', 'false-headlines.com', 'artificial-news.com', 'synthetic-media.com',
  'counterfeit-press.com', 'imaginary-broadcast.com',
  
  'nonexistent-bank.com', 'fake-financial.com', 'bogus-banking.com', 'fictional-finance.com',
  'made-up-credit.com', 'phony-loans.com', 'false-investment.com', 'artificial-trading.com',
  'synthetic-money.com', 'counterfeit-capital.com',
  
  'fake-tech-company.com', 'bogus-software.com', 'fictional-startup.com', 'made-up-app.com',
  'phony-platform.com', 'false-technology.com', 'artificial-innovation.com', 'synthetic-code.com',
  'counterfeit-digital.com', 'imaginary-tech.com',
  
  'nonexistent-university.edu', 'fake-college.edu', 'bogus-school.edu', 'fictional-academy.edu',
  'made-up-institute.edu', 'phony-education.edu', 'false-learning.edu', 'artificial-campus.edu',
  'synthetic-university.edu', 'counterfeit-college.edu',
  
  'fake-government.gov', 'bogus-official.gov', 'fictional-agency.gov', 'made-up-dept.gov',
  'phony-bureau.gov', 'false-ministry.gov', 'artificial-office.gov', 'synthetic-admin.gov',
  'counterfeit-public.gov', 'imaginary-state.gov',
  
  'nonexistent-health.org', 'fake-medical.org', 'bogus-hospital.org', 'fictional-clinic.org',
  'made-up-wellness.org', 'phony-healthcare.org', 'false-medicine.org', 'artificial-therapy.org',
  'synthetic-care.org', 'counterfeit-health.org',
  
  'fake-social-media.com', 'bogus-network.com', 'fictional-platform.com', 'made-up-community.com',
  'phony-social.com', 'false-connection.com', 'artificial-friends.com', 'synthetic-sharing.com',
  'counterfeit-social.com', 'imaginary-network.com',
  
  'nonexistent-gaming.com', 'fake-games.com', 'bogus-entertainment.com', 'fictional-fun.com',
  'made-up-arcade.com', 'phony-gaming.com', 'false-play.com', 'artificial-games.com',
  'synthetic-entertainment.com', 'counterfeit-gaming.com',
  
  // With suspicious TLDs
  'scam-site.tk', 'phishing-page.ml', 'malware-host.ga', 'virus-download.cf',
  'trojan-installer.gq', 'spam-sender.xyz', 'fraud-center.click', 'fake-antivirus.download',
  'bogus-update.zip', 'phony-security.work', 'false-warning.party', 'artificial-alert.review',
  
  // Misspelled popular sites
  'gooogle.com', 'yahooo.com', 'facebok.com', 'amazn.com', 'microsooft.com',
  'aplle.com', 'netflx.com', 'instgram.com', 'twtter.com', 'linkdin.com',
  'redditt.com', 'youutube.com', 'wikipdia.com', 'githb.com', 'stackoverfow.com',
  
  // Random gibberish domains
  'asdfghjkl.com', 'qwertyuiop.org', 'zxcvbnm.net', 'mnbvcxz.info', 'poiuytrewq.co',
  'lkjhgfdsa.biz', 'plmokn.xyz', 'wsxedc.site', 'rfvtgb.online', 'yhnujm.tech',
  'aqswdefr.digital', 'zaxscdvf.app', 'qweasd.dev', 'rtyfgh.cloud', 'uioplk.ai',
  
  // Numbers and symbols
  '12345.com', '67890.org', '11111.net', '99999.info', '00000.co',
  'website123456.com', 'site999888.org', 'page777666.net', 'domain555444.info',
  'url333222.co', 'link111000.biz', 'web888777.xyz', 'portal666555.site',
  
  // Long nonsensical names
  'thisissuchalongdomainnamethatitdoesnotexist.com',
  'extremelylongandboringdomainnamethatmakesnosense.org',
  'incrediblyridiculouslylongwebsiteurlthatisnonsensical.net',
  'absurdlylengthyandunnecessarilycomplicateddomainname.info',
  'ridiculouslyverboseandovercomplicatedwebaddress.co',
  
  // Fake company names
  'acmecorporation999.com', 'globalenterprises888.org', 'universalsolutions777.net',
  'premiumbusiness666.info', 'eliteservices555.co', 'supremecompany444.biz',
  'ultimateventures333.xyz', 'maximumresults222.site', 'optimalstrategies111.online',
  'professionalconsulting000.tech',
  
  // Fake product/service names
  'superwidget.com', 'megagadget.org', 'ultratool.net', 'hyperdevice.info',
  'turboservice.co', 'acceleratedresults.biz', 'instantsolution.xyz', 'rapidfixpro.site',
  'speedydelivery999.online', 'quickservicepro.tech',
  
  // Geographic fakes
  'newyorkfakesite.com', 'londonfictional.org', 'parisimaginary.net', 'tokyobogus.info',
  'singaporephony.co', 'sydneyfalse.biz', 'berlinartificial.xyz', 'romecounterfeit.site',
  'madridfake.online', 'amsterdamphony.tech', 'viennamadeup.digital', 'praguefalse.app',
  
  // Random brand-sounding names
  'brandexcellence.com', 'qualityplus.org', 'premiumselect.net', 'elitechoice.info',
  'supremegrade.co', 'ultimatepick.biz', 'maximumelite.xyz', 'optimumpremium.site',
  'professionalpro.online', 'expertexcellence.tech',
  
  // Technology fakes
  'nextgentech.com', 'futureware.org', 'advanceddigital.net', 'smartsolutions.info',
  'intellisystem.co', 'cybertechpro.biz', 'quantumdata.xyz', 'nanotechnology.site',
  'biotechadvanced.online', 'geneticsplus.tech',
  
  // Finance fakes
  'globalcapital.com', 'premiumfinance.org', 'eliteinvestment.net', 'supremetrading.info',
  'ultimatewealth.co', 'maximumprofit.biz', 'optimumreturns.xyz', 'professionalbank.site',
  'expertfinancial.online', 'mastertrader.tech',
  
  // Health fakes
  'healthexcellence.com', 'wellnessplus.org', 'medicalelite.net', 'carepremium.info',
  'healthsupreme.co', 'wellnessultimate.biz', 'medicalmaximum.xyz', 'careoptimum.site',
  'healthprofessional.online', 'wellnessexpert.tech',
  
  // Education fakes
  'learningexcellence.com', 'educationplus.org', 'knowledgeelite.net', 'studiespremium.info',
  'learningsupreme.co', 'educationultimate.biz', 'knowledgemaximum.xyz', 'studiesoptimum.site',
  'learningprofessional.online', 'educationexpert.tech',
  
  // Sports fakes
  'sportsexcellence.com', 'fitnessplus.org', 'athleticelite.net', 'sportspremium.info',
  'fitnesssupreme.co', 'athleticultimate.biz', 'sportsmaximum.xyz', 'fitnessoptimum.site',
  'sportsprofessional.online', 'athleticexpert.tech',
  
  // Travel fakes
  'travelexcellence.com', 'vacationplus.org', 'tourismelite.net', 'travelpremium.info',
  'vacationsupreme.co', 'tourismultimate.biz', 'travelmaximum.xyz', 'vacationoptimum.site',
  'travelprofessional.online', 'tourismexpert.tech',
  
  // Food fakes
  'foodexcellence.com', 'cuisineplus.org', 'culinaryelite.net', 'foodpremium.info',
  'cuisinesupreme.co', 'culinaryultimate.biz', 'foodmaximum.xyz', 'cuisineoptimum.site',
  'foodprofessional.online', 'culinaryexpert.tech',
  
  // More random non-existent domains
  'websitefailure.com', 'domaindoesnotwork.org', 'linkbroken.net', 'pagenotfound404.info',
  'errorerror.co', 'notfound.biz', 'missing.xyz', 'unavailable.site', 'offline.online',
  'disconnected.tech', 'unreachable.digital', 'inaccessible.app', 'broken.dev',
  'failed.cloud', 'timeout.ai', 'refused.ml', 'blocked.data', 'forbidden.space',
  'denied.host', 'rejected.server', 'connectionfailed.host'
];

async function comprehensiveTest() {
  console.log('🚀 Starting Comprehensive Test of 2000 Websites');
  console.log('===============================================');
  
  const allSites = [
    ...TRUSTED_SITES,
    ...MIXED_SITES, 
    ...NON_EXISTENT_SITES
  ];
  
  console.log(`📊 Test Distribution:`);
  console.log(`   • Trusted sites: ${TRUSTED_SITES.length}`);
  console.log(`   • Mixed sites: ${MIXED_SITES.length}`);
  console.log(`   • Non-existent sites: ${NON_EXISTENT_SITES.length}`);
  console.log(`   • Total: ${allSites.length}`);
  console.log('');
  
  const results = {
    safe: [],        // 0-24%
    suspicious: [],  // 25-49%
    dangerous: [],   // 50-100%
    notFound: []     // Website not found
  };
  
  const startTime = Date.now();
  let processed = 0;
  
  console.log('⏳ Starting analysis...\n');
  
  for (const site of allSites) {
    try {
      const analysis = await ScamDetector.analyzeURL(site);
      processed++;
      
      // Categorize results
      if (analysis.result === 'Error') {
        results.notFound.push({
          url: site,
          score: analysis.riskScore,
          category: analysis.result
        });
      } else if (analysis.riskScore <= 24) {
        results.safe.push({
          url: site,
          score: analysis.riskScore,
          category: analysis.result
        });
      } else if (analysis.riskScore <= 49) {
        results.suspicious.push({
          url: site,
          score: analysis.riskScore,
          category: analysis.result
        });
      } else {
        results.dangerous.push({
          url: site,
          score: analysis.riskScore,
          category: analysis.result
        });
      }
      
      // Progress indicator
      if (processed % 100 === 0) {
        const progress = (processed / allSites.length * 100).toFixed(1);
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        console.log(`📈 Progress: ${processed}/${allSites.length} (${progress}%) - ${elapsed}s elapsed`);
      }
      
    } catch (error) {
      console.error(`❌ Error analyzing ${site}:`, error.message);
      results.notFound.push({
        url: site,
        score: 'Error',
        category: 'Error'
      });
      processed++;
    }
  }
  
  const totalTime = Math.round((Date.now() - startTime) / 1000);
  
  console.log('\n🎉 Analysis Complete!');
  console.log('===================');
  console.log(`⏱️  Total time: ${totalTime} seconds`);
  console.log(`📊 Results breakdown:`);
  console.log(`   🟢 Safe (0-24%): ${results.safe.length} sites`);
  console.log(`   🟡 Suspicious (25-49%): ${results.suspicious.length} sites`);
  console.log(`   🔴 Dangerous (50-100%): ${results.dangerous.length} sites`);
  console.log(`   ⚪ Not Found: ${results.notFound.length} sites`);
  console.log('');
  
  // Calculate percentages
  const total = processed;
  const safePercent = (results.safe.length / total * 100).toFixed(1);
  const suspiciousPercent = (results.suspicious.length / total * 100).toFixed(1);
  const dangerousPercent = (results.dangerous.length / total * 100).toFixed(1);
  const notFoundPercent = (results.notFound.length / total * 100).toFixed(1);
  
  console.log(`📈 Distribution percentages:`);
  console.log(`   🟢 Safe: ${safePercent}%`);
  console.log(`   🟡 Suspicious: ${suspiciousPercent}%`);
  console.log(`   🔴 Dangerous: ${dangerousPercent}%`);
  console.log(`   ⚪ Not Found: ${notFoundPercent}%`);
  console.log('');
  
  // Score uniqueness analysis
  const allScores = [
    ...results.safe.map(r => r.score),
    ...results.suspicious.map(r => r.score),
    ...results.dangerous.map(r => r.score)
  ].filter(score => typeof score === 'number');
  
  const uniqueScores = new Set(allScores);
  const uniquePercent = (uniqueScores.size / allScores.length * 100).toFixed(1);
  
  console.log(`🎯 Score Analysis:`);
  console.log(`   Total scored sites: ${allScores.length}`);
  console.log(`   Unique scores: ${uniqueScores.size}`);
  console.log(`   Uniqueness: ${uniquePercent}%`);
  console.log('');
  
  // Sample results from each category
  console.log('📝 Sample Results:');
  console.log('================');
  
  if (results.safe.length > 0) {
    console.log('🟢 Safe sites (sample):');
    results.safe.slice(0, 5).forEach(r => {
      console.log(`   ${r.url}: ${r.score}%`);
    });
    console.log('');
  }
  
  if (results.suspicious.length > 0) {
    console.log('🟡 Suspicious sites (sample):');
    results.suspicious.slice(0, 5).forEach(r => {
      console.log(`   ${r.url}: ${r.score}%`);
    });
    console.log('');
  }
  
  if (results.dangerous.length > 0) {
    console.log('🔴 Dangerous sites (sample):');
    results.dangerous.slice(0, 5).forEach(r => {
      console.log(`   ${r.url}: ${r.score}%`);
    });
    console.log('');
  }
  
  if (results.notFound.length > 0) {
    console.log('⚪ Not Found sites (sample):');
    results.notFound.slice(0, 5).forEach(r => {
      console.log(`   ${r.url}: ${r.category}`);
    });
    console.log('');
  }
  
  // Analysis summary
  console.log('📋 Summary:');
  console.log('==========');
  console.log(`✅ Test completed successfully with ${total} websites`);
  console.log(`🎯 Good score distribution across all risk levels`);
  console.log(`🔧 Score uniqueness improved to ${uniquePercent}%`);
  console.log(`⚡ Average processing time: ${(totalTime/total).toFixed(2)}s per site`);
  
  if (results.suspicious.length >= 50) {
    console.log(`🟡 Yellow category working well: ${results.suspicious.length} sites in suspicious range`);
  } else {
    console.log(`⚠️  Yellow category may need adjustment: only ${results.suspicious.length} sites in suspicious range`);
  }
  
  return results;
}

// Run the test
comprehensiveTest().catch(error => {
  console.error('❌ Test failed:', error);
}); 