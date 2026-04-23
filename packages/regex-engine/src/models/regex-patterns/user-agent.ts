/**
 * **User Agent Brand Patterns**
 *
 * Used for identifying hardware manufacturers from raw User Agent strings.
 * Note: These should be executed with the 'i' flag.
 */
export const USER_AGENT_BRAND_PATTERNS = {
  /**
   * **Apple Devices**
   * Matches iPhone, iPad, iPod, and Mac systems.
   * @pattern `iPhone|iPad|iPod|Mac` (Case-Insensitive)
   */
  userAgentAppleBrand: 'iPhone|iPad|iPod|Mac',

  /**
   * **Samsung Devices**
   * Matches official brand name, Galaxy line, and SM- model prefixes.
   * @pattern `Samsung|SM-|Galaxy` (Case-Insensitive)
   */
  userAgentSamsungBrand: 'Samsung|SM-|Galaxy',

  /**
   * **Google Devices**
   * Specifically targets the Pixel hardware line.
   * @pattern `Pixel` (Case-Insensitive)
   */
  userAgentGoogleBrand: 'Pixel',

  /**
   * **Huawei Devices**
   * Matches both standard and uppercase variations.
   * @pattern `Huawei|HUAWEI` (Case-Insensitive)
   */
  userAgentHuaweiBrand: 'Huawei|HUAWEI',

  /**
   * **Xiaomi Devices**
   * Matches Xiaomi brand and the "Mi" device space.
   * @pattern `Xiaomi|Mi ` (Case-Insensitive)
   */
  userAgentXiaomiBrand: 'Xiaomi|Mi ',

  /**
   * **OnePlus Devices**
   * Matches brand name.
   * @pattern `OnePlus` (Case-Insensitive)
   */
  userAgentOnePlusBrand: 'OnePlus',

  /**
   * **LG Devices**
   * Matches model prefixes (LG-) and brand spacing.
   * @pattern `LG-|LG ` (Case-Insensitive)
   */
  userAgentLgBrand: 'LG-|LG ',

  /**
   * **Sony Devices**
   * Matches brand name and the Xperia mobile line.
   * @pattern `Sony|Xperia` (Case-Insensitive)
   */
  userAgentSonyBrand: 'Sony|Xperia',

  /**
   * **Nokia Devices**
   * Matches brand name.
   * @pattern `Nokia` (Case-Insensitive)
   */
  userAgentNokiaBrand: 'Nokia',

  /**
   * **Motorola Devices**
   * Matches brand name and the "Moto" line spacing.
   * @pattern `Motorola|Moto ` (Case-Insensitive)
   */
  userAgentMotorolaBrand: 'Motorola|Moto ',
} as const;
export const USER_AGENT_DEVICE_PATTERNS = {
  /**
   * **Mobile Devices**
   * Detects smartphones including iPhone, Android, and Windows Phone.
   * @pattern `iphone|ipod|android|blackberry|windows phone|iemobile|opera mini`
   */
  userAgentMobileDevice:
    'iphone|ipod|android|blackberry|windows phone|iemobile|opera mini',

  /**
   * **Tablet Devices**
   * Detects iPads and Android tablets while excluding mobile phones.
   * @pattern `(ipad|tablet|playbook|silk)|(android(?!.*mobile))`
   */
  userAgentTabletDevice: '(ipad|tablet|playbook|silk)|(android(?!.*mobile))',

  /**
   * **Bot & Crawler Detection**
   * Identifies search engine spiders and audit tools like Lighthouse.
   */
  userAgentBotDevice:
    'bot|crawler|spider|crawling|googlebot|bingbot|yahoo|duckduckbot|baidu|yandex|teoma|slurp|facebookexternalhit|lighthouse',
} as const;

export const USER_AGENT_OS_PATTERNS = {
  userAgentWindowsOs: 'Windows NT (\\d+\\.\\d+)',
  userAgentWindowsPhoneOs: 'Windows Phone',
  userAgentIosOs: 'iPhone|iPad|iPod',
  userAgentIosVersion: 'OS (\\d+[._]\\d+)',
  userAgentMacOs: 'Macintosh|Mac OS X',
  userAgentMacOsVersion: 'Mac OS X (\\d+[._]\\d+)',
  userAgentAndroidOs: 'Android',
  userAgentAndroidVersion: 'Android (\\d+(\\.\\d+)?)',
  userAgentLinuxOs: 'Linux',
  userAgentUnixOs: 'X11',
} as const;

export const USER_AGENT_BROWSER_PATTERNS = {
  userAgentEdgeBrowser: 'Edge|Edg',
  userAgentEdgeVersion: '(Edge|Edg)\\/(\\d+(\\.\\d+)?)',
  userAgentIeBrowser: 'MSIE|Trident',
  userAgentIeVersion: 'MSIE (\\d+(\\.\\d+)?)|rv:(\\d+(\\.\\d+)?)',
  userAgentChromeBrowser: 'Chrome',
  userAgentChromeVersion: 'Chrome\\/(\\d+(\\.\\d+)?)',
  userAgentFirefoxBrowser: 'Firefox',
  userAgentFirefoxVersion: 'Firefox\\/(\\d+(\\.\\d+)?)',
  userAgentSafariBrowser: 'Safari',
  userAgentSafariVersion: 'Version\\/(\\d+(\\.\\d+)?)',
  userAgentOperaBrowser: 'Opera|OPR',
  userAgentOperaVersion: 'OPR\\/(\\d+(\\.\\d+)?)',
} as const;
