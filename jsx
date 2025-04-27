import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from 'axios';
import html2canvas from 'html2canvas';
import './labelDesigner.css';
import Icon from './components/icon';

export default function LabelDesigner() {
    const [text, setText] = useState("");
    const [font, setFont] = useState("Arial");
    const [fontCategory, setFontCategory] = useState("All");
    const [textColor, setTextColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [icon, setIcon] = useState("none");
    const [iconCategory, setIconCategory] = useState("All");
    const [iconPosition, setIconPosition] = useState("none");
    const [labelWidth, setLabelWidth] = useState(60);
    const [labelHeight, setLabelHeight] = useState(24);
    const [quantity, setQuantity] = useState(1000);
    const [loading, setLoading] = useState(false);
    const [frameStyle, setFrameStyle] = useState('none');
    const [applicationMethod, setApplicationMethod] = useState('sew-on');
    const [fontSize, setFontSize] = useState(24);
    const [labelType, setLabelType] = useState('printed');
    const [fabricType, setFabricType] = useState('satin');
    const [extras, setExtras] = useState({ zemindouble: false, ultrasonicCutting: false });
    const [textAlignment, setTextAlignment] = useState('middle-center');
    const [selectedQuality, setSelectedQuality] = useState('standard');
    const [overlay, setOverlay] = useState({ show: false, message: '', onConfirm: null });
    const [scrollPosition, setScrollPosition] = useState(0);
    const categorySliderRef = useRef(null);
    const labelRef = useRef(null);
    const fontCategorySliderRef = useRef(null);
    const [fontScrollPosition, setFontScrollPosition] = useState(0);

    const fontCategories = useMemo(() => {
        // Önce orijinal kategorileri tanımla
        const baseCategories = {
            "Sans Serif": [
                "Roboto", // Temiz, modern, çok yönlü
                "Open Sans", // Okunabilir, sade
                "Montserrat", // Geometrik, şık
                "Poppins", // Yuvarlak, dostane
                "Inter", // UI için optimize, net
                "Lato", // Dengeli, profesyonel
                "Rubik", // Hafif eğlenceli, modern
                "Work Sans", // Hafif ince, çağdaş
                "Nunito", // Yuvarlak, samimi
                "Source Sans 3", // Çok yönlü, okunabilir
                "Barlow", // Modern, hafif kondense
                "Public Sans", // Resmi, temiz
            ],
            "Serif": [
                "Playfair Display", // Zarif, dekoratif
                "Merriweather", // Okunabilir, klasik
                "Lora", // Yumuşak, edebi
                "Crimson Pro", // Sofistike, tarihsel
                "Libre Baskerville", // Kitaplar için ideal
                "EB Garamond", // Rönesans esintili
                "Zilla Slab", // Modern serif, güçlü
                "Cardo", // Akademik, zarif
                "Bitter", // Kalın, modern serif
                "PT Serif", // Dengeli, klasik
                "Vollkorn", // Sağlam, tarihsel
                "Source Serif 4", // Çok yönlü, okunabilir
            ],
            "Handwriting": [
                "Caveat", // Rahat, el yazısı tarzı
                "Dancing Script", // Akıcı, zarif
                "Patrick Hand", // Samimi, düzgün
                "Indie Flower", // Çizgili, eğlenceli
                "Kalam", // Kalın, doğal
                "Shadows Into Light", // İnce, kişisel
                "Amatic SC", // El yazısı, cesur
                "Architects Daughter", // Sevimli, casual
                "Gochi Hand", // Çocukça, eğlenceli
                "Annie Use Your Telescope", // El yazısı, samimi
                "Coming Soon", // İnce, rahat
                "Nothing You Could Do", // Fırça tarzı, doğal
            ],
            "Decorative": [
                "Bebas Neue", // Kalın, dramatik
                "Oswald", // Kondense, güçlü
                "Lobster", // Retro, süslü
                "Abril Fatface", // Art deco, çarpıcı
                "Bangers", // Çizgi roman tarzı
                "Alfa Slab One", // Kalın, slab serif
                "Shrikhand", // Etnik, dekoratif
                "Fredericka the Great", // Gotik, süslü
                "Black Han Sans", // Kalın, sans-serif benzeri
                "Big Shoulders Display", // Geometrik, endüstriyel
                "Passion One", // Enerjik, yuvarlak
                "Rammetto One", // Eğlenceli, dekoratif
            ],
            "Modern": [
                "Futura", // Geometrik, fütüristik
                "Manrope", // Minimal, yuvarlak
                "Overpass", // Teknolojik, temiz
                "Jost", // Modern, sofistike
                "Sora", // İnce, çağdaş
                "Outfit", // Moda odaklı, zarif
                "Chivo", // Net, profesyonel
                "Karla", // Minimalist, dostane
                "Archivo", // Geometrik, modern
                "DM Sans", // Temiz, çok yönlü
                "Exo 2", // Teknolojik, yuvarlak
                "Cabin", // Modern, dengeli
            ],
            "Vintage": [
                "Special Elite", // Daktilo tarzı
                "Old Standard TT", // Antik, klasik
                "Cinzel", // Roma esintili
                "IM Fell English", // Tarihsel, el yazması
                "UnifrakturMaguntia", // Gotik, eski Alman
                "Spectral", // Retro, zarif
                "Rye", // Vahşi batı tarzı
                "Almendra", // Ortaçağ esintili
                "Pirata One", // Korsan, dekoratif
                "Metal Mania", // Gotik, heavy metal
                "Germania One", // Alman, tarihsel
                "Caesar Dressing", // Antik Roma esintili
            ],
            "Script": [
                "Great Vibes", // Zarif, kaligrafik
                "Sacramento", // İnce, akıcı
                "Alex Brush", // Romantik, fırça tarzı
                "Kaushan Script", // Enerjik, el yazısı
                "Parisienne", // Fransız, zarif
                "Yellowtail", // Modern kaligrafi
                "Tangerine", // İnce, süslü
                "Clicker Script", // Fırça, dekoratif
                "Allura", // Akıcı, zarif
                "Bad Script", // Düzensiz, el yazısı
                "Lovers Quarrel", // Romantik, süslü
                "Cedarville Cursive", // İnce, kıvrımlı
            ],
            "Monospace": [
                "Fira Code", // Kodlama için optimize
                "IBM Plex Mono", // Modern, net
                "Space Mono", // Geometrik, retro
                "Inconsolata", // Okunabilir, sade
                "Roboto Mono", // Temiz, profesyonel
                "Source Code Pro", // Adobe tasarımı, net
                "JetBrains Mono", // Programlama dostu
                "Courier Prime", // Klasik daktilo tarzı
                "Overpass Mono", // Modern, teknolojik
                "Ubuntu Mono", // Yuvarlak, okunabilir
                "VT323", // Retro, dijital
                "Share Tech Mono", // Teknolojik, net
            ],
        };

        // Tüm fontları tek bir dizide topla
        const allFonts = [...new Set(Object.values(baseCategories).flat())];

        // All kategorisini ekle ve diğer kategorilerle birleştir
        return {
            "All": allFonts,
            ...baseCategories
        };
    }, []);

    const iconCategories = useMemo(() => {
        const categories = [
            {
                name: 'Letters',
                icon: 'a',
                icons: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
            },
            {
                name: 'Numbers',
                icon: 'circle-number-1',
                icons: ['circle-number-0', 'circle-number-1', 'circle-number-2', 'circle-number-3', 'circle-number-4', 'circle-number-5',
                    'circle-number-6', 'circle-number-7', 'circle-number-8', 'circle-number-9', 'number-0', 'number-1', 'number-2',
                    'number-3', 'number-4', 'number-5', 'number-6', 'number-7', 'number-8', 'number-9', 'number-0-alt', 'number-1-alt',
                    'number-2-alt', 'number-3-alt', 'number-4-alt', 'number-5-alt', 'number-6-alt', 'number-7-alt', 'number-8-alt', 'number-9-alt']
            },
            {
                name: 'Arrows',
                icon: 'arrow-right',
                icons: ['arrow-down', 'arrow-down-from-line', 'arrow-down-left', 'arrow-down-right', 'arrow-down-short-wide',
                    'arrow-down-to-bracket', 'arrow-down-to-line', 'arrow-down-wide-short', 'arrow-left', 'arrow-left-arrow-right',
                    'arrow-left-from-line', 'arrow-left-to-line', 'arrow-right', 'arrow-right-from-bracket', 'arrow-right-from-line',
                    'arrow-right-to-bracket', 'arrow-right-to-line', 'arrow-rotate-left', 'arrow-rotate-right', 'arrow-trend-down',
                    'arrow-trend-up', 'arrow-turn-down-left', 'arrow-turn-down-right', 'arrow-turn-left-down', 'arrow-turn-left-up',
                    'arrow-turn-right-down', 'arrow-turn-right-up', 'arrow-turn-up-left', 'arrow-turn-up-right', 'arrow-up',
                    'arrows-left-right', 'arrows-repeat', 'arrows-rotate-clockwise', 'arrows-rotate-counter-clockwise']
            },
            {
                name: 'Shapes',
                icon: 'circle',
                icons: ['circle', 'circle-half', 'diamond', 'diamond-half', 'diamond-shape', 'hexagon', 'octagon', 'octagon-exclamation',
                    'square', 'square-checkmark', 'square-divide', 'square-equals', 'square-minus', 'square-plus', 'square-x',
                    'triangle', 'triangle-exclamation']
            },
            {
                name: 'Text Formatting',
                icon: 'align-left',
                icons: ['align-bottom', 'align-center-horizontal', 'align-center-vertical', 'align-left', 'align-right', 'align-text-center',
                    'align-text-justify', 'align-text-right', 'align-top', 'bold', 'italic', 'underline', 'cursor', 'cursor-click',
                    'grid', 'grid-masonry', 'maximize', 'minimize', 'sidebar-left', 'sidebar-right']
            },
            {
                name: 'Media',
                icon: 'microphone',
                icons: ['camera', 'camera-slash', 'desktop', 'film', 'headphones', 'image', 'images', 'laptop', 'microphone',
                    'microphone-slash', 'mobile', 'phone', 'phone-slash', 'tv', 'tv-retro', 'video', 'video-camera', 'video-camera-slash']
            },
            {
                name: 'Weather',
                icon: 'cloud',
                icons: ['cloud', 'cloud-arrow-down', 'cloud-arrow-up', 'cloud-fog', 'cloud-lightning', 'cloud-rain', 'cloud-snow',
                    'moon', 'moon-cloud', 'moon-fog', 'rainbow', 'rainbow-cloud', 'sun', 'sun-cloud', 'sun-fog', 'wind']
            },
            {
                name: 'Tools',
                icon: 'key',
                icons: ['book', 'book-open', 'bookmark', 'bookmark-plus', 'books', 'key', 'key-skeleton', 'keyboard',
                    'toolbox', 'wrench', 'pencil', 'pen-nib', 'palette', 'ruler', 'scissors']
            },
            {
                name: 'Food & Drink',
                icon: 'utensils',
                icons: ['bottle', 'cake', 'cake-slice', 'citrus-slice', 'cocktail', 'cupcake', 'ice-cream', 'mug',
                    'pizza', 'soda', 'utensils', 'wine-glass']
            },
            {
                name: 'Currency',
                icon: 'dollar',
                icons: ['british-pound', 'dollar', 'euro', 'yen', 'credit-card', 'money', 'receipt', 'wallet']
            },
            {
                name: 'Emojis',
                icon: 'face-smile',
                icons: ['face-angry', 'face-cry', 'face-laugh', 'face-meh', 'face-melt', 'face-no-mouth', 'face-open-mouth',
                    'face-sad', 'face-smile', 'person', 'person-walking', 'person-wave', 'user', 'users']
            },
            {
                name: 'Sports',
                icon: 'dice',
                icons: ['baseball', 'baseball-bat', 'basketball', 'dice', 'die-1', 'die-2', 'die-3', 'die-4', 'die-5',
                    'die-6', 'football', 'game-controller', 'hockey', 'joystick', 'soccer', 'tennis-ball']
            },
            {
                name: 'Zodiac',
                icon: 'star',
                icons: ['aquarius', 'aries', 'cancer', 'capricorn', 'gemini', 'leo', 'libra', 'pisces', 'sagittarius',
                    'scorpio', 'taurus', 'virgo', 'star', 'star-half']
            }
        ];

        const allIcons = [...new Set(categories.flatMap(cat => cat.icons))];
        return [
            {
                name: 'All',
                icon: 'star',
                icons: allIcons
            },
            ...categories
        ];
    }, []);

    const displayedIcons = useMemo(() => {
        const selectedCategory = iconCategories.find(cat => cat.name === iconCategory);
        return selectedCategory ? selectedCategory.icons : [];
    }, [iconCategory, iconCategories]);

    const scrollCategories = useCallback((direction) => {
        const container = categorySliderRef.current;
        if (container) {
            const scrollAmount = 200;
            const newPosition = direction === 'left'
                ? scrollPosition - scrollAmount
                : scrollPosition + scrollAmount;

            container.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });

            setScrollPosition(newPosition);
        }
    }, [scrollPosition]);

    const alignmentOptions = useMemo(() => [
        { value: 'top-left', label: 'Top Left', preview: 'T' },
        { value: 'top-center', label: 'Top Center', preview: 'T' },
        { value: 'top-right', label: 'Top Right', preview: 'T' },
        { value: 'middle-left', label: 'Middle Left', preview: 'T' },
        { value: 'middle-center', label: 'Middle Center', preview: 'T' },
        { value: 'middle-right', label: 'Middle Right', preview: 'T' },
        { value: 'bottom-left', label: 'Bottom Left', preview: 'T' },
        { value: 'bottom-center', label: 'Bottom Center', preview: 'T' },
        { value: 'bottom-right', label: 'Bottom Right', preview: 'T' }
    ], []);

    const iconPositions = useMemo(() => [
        { value: 'none', label: 'No Icon', preview: 'Text' },
        { value: 'left', label: 'Left Icon', preview: '★ Text' },
        { value: 'both', label: 'Both Sides', preview: '★ Text ★' },
        { value: 'right', label: 'Right Icon', preview: 'Text ★' }
    ], []);

    const colorPalette = useMemo(() => [
        "#000000", "#FFFFFF",
        "#FF0000", "#FF3333", "#FF6666", "#FF9999", "#FFCCCC",
        "#FF4500", "#FF5E1A", "#FF7733", "#FF914D", "#FFAA66",
        "#FFD700", "#FFDF33", "#FFE566", "#FFEB99", "#FFF1CC",
        "#008000", "#1A8C1A", "#33A133", "#4DB54D", "#66C966",
        "#0000FF", "#3333FF", "#6666FF", "#9999FF", "#CCCCFF",
        "#800080", "#8C1A8C", "#A133A1", "#B54DB5", "#C966C9",
        "#FF69B4", "#FF7ABC", "#FF8CC4", "#FF9ECC", "#FFB0D4",
        "#333333", "#4D4D4D", "#666666", "#808080", "#999999",
        "#8B4513", "#A0522D", "#B5651D", "#C97828", "#DB8B33",
        "#00CED1", "#1AD4D7", "#33DADD", "#4DE0E3", "#66E6E9",
        "#4169E1", "#5277E5", "#6385E9", "#7493ED", "#85A1F1",
        "#32CD32", "#43D143", "#54D554", "#65D965", "#76DD76",
        "#2F4F4F", "#3B5A5A", "#476565", "#537070", "#5F7B7B",
        "#FFB6C1", "#FFDBC1", "#FFFACD", "#E6E6FA", "#D3F9D8"
    ], []);

    const sizeOptions = useMemo(() => [
        { name: 'Small', width: 50, height: 19, label: 'Small\n100x40', info: 'Best for small items' },
        { name: 'Medium', width: 60, height: 24, label: 'Standard\n140x60', info: 'Standard size' },
        { name: 'Large', width: 70, height: 29, label: 'Büyük\n200x80', info: 'Best for large items' }
    ], []);

    const scrollFontCategories = useCallback((direction) => {
        const container = fontCategorySliderRef.current;
        if (container) {
            const scrollAmount = 200;
            const newPosition = direction === 'left'
                ? fontScrollPosition - scrollAmount
                : fontScrollPosition + scrollAmount;

            container.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });

            setFontScrollPosition(newPosition);
        }
    }, [fontScrollPosition]);

    const getFontSizeRange = useCallback(() => {
        let minSize, maxSize;
        if (labelWidth === 50 && labelHeight === 19) {
            minSize = 12;
            maxSize = 54;
        } else if (labelWidth === 60 && labelHeight === 24) {
            minSize = 18;
            maxSize = 78;
        } else if (labelWidth === 70 && labelHeight === 29) {
            minSize = 24;
            maxSize = 92;
        } else {
            minSize = 12;
            maxSize = 36;
        }
        return {
            min: minSize,
            max: maxSize
        };
    }, [labelWidth, labelHeight]);

    const calculateScaleFactor = useCallback((width, height) => {
        const baseWidth = 400;
        const baseHeight = 150;
        let widthScale = baseWidth / 60;
        let heightScale = baseHeight / 24;
        if (width === 70 && height === 30) {
            widthScale *= 1.15;
            heightScale *= 1.15;
        } else if (width === 60 && height === 20) {
            widthScale *= 0.7;
        }
        return { widthScale, heightScale };
    }, []);

    const calculatePrice = useCallback(() => {
        // Settings'in varlığını kontrol et
        if (!window.cld_ajax_obj || !window.cld_ajax_obj.settings) {
            console.error('Settings not found:', window.cld_ajax_obj);
            return { total: '0.00', perPiece: '0.00' };
        }

        const settings = window.cld_ajax_obj.settings;

        // Tüm fiyatları güvenli bir şekilde dönüştür
        const safeNumber = (value) => {
            const num = Number(value);
            return isNaN(num) ? 0 : num;
        };

        // Boyuta göre temel fiyatı belirle
        let basePrice = 0;
        if (labelWidth === 50 && labelHeight === 19) {
            basePrice = safeNumber(settings.price_small);
        } else if (labelWidth === 60 && labelHeight === 24) {
            basePrice = safeNumber(settings.price_medium);
        } else if (labelWidth === 70 && labelHeight === 29) {
            basePrice = safeNumber(settings.price_large);
        }

        // Kalite seçimine göre ek ücret
        switch (selectedQuality) {
            case 'standard':
                basePrice += safeNumber(settings.quality_standard_fee);
                break;
            case 'premium':
                basePrice += safeNumber(settings.quality_premium_fee);
                break;
            case 'eco':
                // eco için ek ücret yok
                break;
            default:
                break;
        }

        // Diğer ücretleri ekle
        if (labelType === 'woven') {
            basePrice += safeNumber(settings.woven_extra_fee);

            if (applicationMethod === 'iron-on') {
                basePrice += safeNumber(settings.woven_iron_on_extra_fee);
            }

            if (extras.zemindouble) {
                basePrice += safeNumber(settings.woven_zemin_double_fee);
            }
            if (extras.ultrasonicCutting) {
                basePrice += safeNumber(settings.woven_ultrasonic_cutting_fee);
            }
        } else if (labelType === 'printed') {
            switch (fabricType) {
                case 'edge-satin':
                    basePrice += safeNumber(settings.fabric_edge_satin_fee);
                    break;
                case 'white-cotton':
                    basePrice += safeNumber(settings.fabric_white_cotton_fee);
                    break;
                case 'organic-cotton':
                    basePrice += safeNumber(settings.fabric_organic_cotton_fee);
                    break;
                default:
                    break;
            }
        }

        // Debug için settings değerlerini konsola yazdır
        console.log('Settings:', settings);
        console.log('Calculated base price:', basePrice);

        return {
            total: (quantity * basePrice).toFixed(2),
            perPiece: basePrice.toFixed(2)
        };
    }, [labelWidth, labelHeight, applicationMethod, quantity, labelType, extras, fabricType, selectedQuality]);

    const captureLabel = useCallback(async () => {
        try {
            await document.fonts.ready;

            const { widthScale, heightScale } = calculateScaleFactor(labelWidth, labelHeight);
            const captureWidth = Math.round(labelWidth * widthScale);
            const captureHeight = Math.round(labelHeight * heightScale);

            const container = document.createElement('div');
            container.style.cssText = `
            position: fixed;
            left: -9999px;
            top: -9999px;
            width: ${captureWidth}px;
            height: ${captureHeight}px;
            background-color: ${bgColor};
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-radius: 0;
        `;

            const baseSpacing = Math.max(
                Math.min(labelWidth, labelHeight) * 0.08,
                12
            );

            const config = {
                none: {
                    padding: { v: labelHeight * 0.18, h: labelWidth * 0.18 }
                },
                single: {
                    borderWidth: 1.5,
                    outerPadding: baseSpacing,
                    padding: { v: labelHeight * 0.15, h: labelWidth * 0.15 }
                },
                double: {
                    borderWidth: 1.5,
                    outerPadding: baseSpacing,
                    innerPadding: baseSpacing * 2,
                    padding: { v: labelHeight * 0.15, h: labelWidth * 0.15 }
                }
            };

            const currentConfig = config[frameStyle];

            const labelBody = document.createElement('div');
            labelBody.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        `;
            container.appendChild(labelBody);

            if (frameStyle === 'single' || frameStyle === 'double') {
                const outerFrame = document.createElement('div');
                outerFrame.style.cssText = `
                position: absolute;
                top: ${currentConfig.outerPadding}px;
                left: ${currentConfig.outerPadding}px;
                right: ${currentConfig.outerPadding}px;
                bottom: ${currentConfig.outerPadding}px;
                border: ${currentConfig.borderWidth}px solid ${textColor};
                box-sizing: border-box;
            `;
                labelBody.appendChild(outerFrame);

                if (frameStyle === 'double') {
                    const innerFrame = document.createElement('div');
                    innerFrame.style.cssText = `
                    position: absolute;
                    top: ${currentConfig.innerPadding}px;
                    left: ${currentConfig.innerPadding}px;
                    right: ${currentConfig.innerPadding}px;
                    bottom: ${currentConfig.innerPadding}px;
                    border: ${currentConfig.borderWidth}px solid ${textColor};
                    box-sizing: border-box;
                `;
                    labelBody.appendChild(innerFrame);
                }
            }

            const contentWrapper = document.createElement('div');
            const [vertical, horizontal] = textAlignment.split('-');

            const alignmentStyles = {
                top: 'flex-start',
                middle: 'center',
                bottom: 'flex-end',
                left: 'flex-start',
                center: 'center',
                right: 'flex-end'
            };

            const contentPadding = frameStyle === 'double'
                ? currentConfig.innerPadding + currentConfig.borderWidth * 2
                : frameStyle === 'single'
                    ? currentConfig.outerPadding + currentConfig.borderWidth * 2
                    : 0;

            contentWrapper.style.cssText = `
            position: absolute;
            top: ${contentPadding}px;
            left: ${contentPadding}px;
            right: ${contentPadding}px;
            bottom: ${contentPadding}px;
            display: flex;
            align-items: ${alignmentStyles[vertical]};
            justify-content: ${alignmentStyles[horizontal]};
            padding: ${currentConfig.padding.v}px ${currentConfig.padding.h}px;
            box-sizing: border-box;
            z-index: 1;
        `;

            const textContainer = document.createElement('div');
            textContainer.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: ${alignmentStyles[horizontal]};
    width: 100%;
    color: ${textColor};
    font-family: '${font}', sans-serif;
    font-size: ${fontSize}px;
    line-height: 1.2;
    max-width: 100%;
    word-break: keep-all;
    overflow-wrap: normal;
    white-space: normal;
`;

            const iconWidth = icon !== 'none' ? (iconPosition === 'both' ? fontSize * 1.5 : fontSize * 0.75) : 0;
            const iconGap = icon !== 'none' ? Math.round(fontSize * 0.3) : 0;
            const totalIconSpace = iconWidth + (iconGap * (iconPosition === 'both' ? 2 : 1));

            const contentInner = document.createElement('div');
            contentInner.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${iconGap}px;
    max-width: calc(100% - ${totalIconSpace}px);
    flex-wrap: wrap; /* nowrap yerine wrap kullanıyoruz */
    word-break: break-word; /* keep-all yerine break-word kullanıyoruz */
    overflow-wrap: break-word; /* normal yerine break-word kullanıyoruz */
    white-space: normal;
    padding: 0 4px; /* Kenarlardan biraz boşluk bırakıyoruz */
`;

            const createIcon = async (iconName) => {
                const iconDiv = document.createElement('div');
                iconDiv.style.cssText = `
                width: ${fontSize * 0.75}px;
                height: ${fontSize * 0.75}px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: ${textColor};
                flex-shrink: 0;
            `;
                const svg = await fetch('assets/sprite.svg').then(res => res.text());
                const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
                const symbol = doc.querySelector(`#${iconName}`);
                iconDiv.innerHTML = symbol ? `<svg viewBox="${symbol.getAttribute('viewBox')}">${symbol.innerHTML}</svg>` : '';
                return iconDiv;
            };

            if (icon !== 'none' && iconPosition !== 'none') {
                if (iconPosition === 'left' || iconPosition === 'both') {
                    const iconElement = await createIcon(icon);
                    contentInner.appendChild(iconElement);
                }

                const textSpan = document.createElement('span');
                textSpan.style.cssText = `
    display: inline-block;
    vertical-align: middle;
    line-height: 1.2;
    text-align: center;
    white-space: normal;
    word-break: break-word; /* keep-all yerine break-word kullanıyoruz */
    overflow-wrap: break-word; /* normal yerine break-word kullanıyoruz */
    hyphens: auto; /* none yerine auto kullanıyoruz */
    transform: translateY(0);
    max-width: 100%;
    min-width: 0; /* Eklendi: minimum genişliği sıfır yapıyoruz */
    flex: 1; /* Eklendi: esnek genişlik kullanıyoruz */
`;

                textSpan.textContent = text;
                contentInner.appendChild(textSpan);

                if (iconPosition === 'right' || iconPosition === 'both') {
                    const iconElement = await createIcon(icon);
                    contentInner.appendChild(iconElement);
                }
            } else {
                const textSpan = document.createElement('span');
                textSpan.style.cssText = `
    display: inline-block;
    vertical-align: middle;
    line-height: 1.2;
    text-align: center;
    white-space: normal;
    word-break: break-word; /* keep-all yerine break-word kullanıyoruz */
    overflow-wrap: break-word; /* normal yerine break-word kullanıyoruz */
    hyphens: auto; /* none yerine auto kullanıyoruz */
    transform: translateY(0);
    max-width: 100%;
    min-width: 0; /* Eklendi: minimum genişliği sıfır yapıyoruz */
    flex: 1; /* Eklendi: esnek genişlik kullanıyoruz */
`;
                textSpan.textContent = text;
                contentInner.appendChild(textSpan);
            }

            textContainer.appendChild(contentInner);
            contentWrapper.appendChild(textContainer);
            labelBody.appendChild(contentWrapper);

            document.body.appendChild(container);
            await new Promise(res => setTimeout(res, 100));

            const canvas = await html2canvas(container, {
                scale: 4, // Daha yüksek çözünürlük için scale'i artırdık
                backgroundColor: bgColor,
                width: captureWidth,
                height: captureHeight,
                imageRendering: 'pixelated', // Daha keskin görüntü için
            });

            document.body.removeChild(container);
            return canvas.toDataURL('image/png', 1.0);
        } catch (e) {
            console.error('captureLabel error:', e);
            throw e;
        }
    }, [bgColor, frameStyle, textColor, font, fontSize, textAlignment, labelWidth, labelHeight, calculateScaleFactor, text, icon, iconPosition]);

    const addToCart = useCallback(async () => {
        if (loading || !text.trim()) {
            alert('Please add label text');
            return;
        }
        setLoading(true);
        try {
            const labelImage = await captureLabel();
            if (!labelImage) {
                throw new Error('Failed to create label image');
            }

            // Fiyat hesaplama
            const priceInfo = calculatePrice();

            const designData = {
                text,
                font,
                fontSize: Math.round(fontSize),
                textColor,
                bgColor,
                icon,
                iconPosition,
                labelWidth,
                labelHeight,
                applicationMethod,
                frameStyle,
                labelType,
                fabricType: labelType === 'printed' ? fabricType : null,
                extras: labelType === 'woven' ? extras : null,
                textAlignment,
                selectedQuality, // Kalite seviyesini ekledik
                imageData: labelImage.split(',')[1],
                created_at: new Date().toISOString(),
                created_by: 'labelgo',
                calculated_price: {
                    per_piece: parseFloat(priceInfo.perPiece),
                    total: parseFloat(priceInfo.total)
                }
            };

            const formData = new FormData();
            formData.append('action', 'add_to_cart_custom_label');
            formData.append('product_id', document.getElementById('label-designer-root').dataset.productId);
            formData.append('quantity', quantity);
            formData.append('label_design', JSON.stringify(designData));
            formData.append('custom_price', priceInfo.perPiece); // Birim fiyatı gönder
            formData.append('security', window.cld_ajax_obj.nonce);

            const response = await axios({
                method: 'POST',
                url: window.cld_ajax_obj.ajax_url,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                window.location.href = response.data.data.cart_url;
            } else {
                throw new Error(response.data.data?.message || 'Error adding to cart');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            alert(error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [applicationMethod, captureLabel, calculatePrice, extras, fabricType, icon, iconPosition,
        labelHeight, labelType, labelWidth, loading, quantity, text, bgColor, frameStyle,
        textColor, font, fontSize, textAlignment, selectedQuality]); // selectedQuality dependency ekledik

    // Çerçeve ve padding değerlerini dinamik olarak hesaplayan yardımcı fonksiyon
    const calculateFrameOffsets = useCallback(() => {
        // Tüm frame tipleri için tutarlı padding değerleri
        const verticalPadding = Math.max(2, labelHeight * 0.02);
        const horizontalPadding = Math.max(4, labelWidth * 0.03);

        // Frame offsetleri frame tipine göre hesaplanıyor
        const verticalFrameOffset = frameStyle === 'double'
            ? Math.max(12, labelHeight * 0.08)
            : frameStyle === 'single'
                ? Math.max(12, labelHeight * 0.08)
                : verticalPadding;

        const horizontalFrameOffset = frameStyle === 'double'
            ? Math.max(12, labelWidth * 0.08)
            : frameStyle === 'single'
                ? Math.max(12, labelWidth * 0.08)
                : horizontalPadding;

        return {
            verticalPadding,
            horizontalPadding,
            verticalFrameOffset,
            horizontalFrameOffset
        };
    }, [frameStyle, labelWidth, labelHeight]);

    const renderLabelContent = useCallback(() => {
        const content = text || 'Enter label text';
        const { verticalPadding, horizontalPadding } = calculateFrameOffsets();

        const containerClassName = `label-container ${frameStyle !== 'none' ? `with-${frameStyle}-frame` : ''}`;
        const textureClass = labelType === 'printed' ? fabricType : labelType === 'woven' ? `woven-${selectedQuality}` : '';

        const availableWidth = `calc(100% - ${horizontalPadding * 2}px)`;
        const availableHeight = `calc(100% - ${verticalPadding * 2}px)`;

        const iconEl = icon !== 'none' ? (
            <span
                className="icon"
                style={{
                    width: `${Math.round(fontSize)}px`,
                    height: `${Math.round(fontSize)}px`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    verticalAlign: 'middle'
                }}
            >
            <Icon name={icon} color={textColor} />
        </span>
        ) : null;

        return (
            <div className={containerClassName}>
                {frameStyle !== 'none' && (
                    <div className="outer-frame" style={{ borderColor: textColor }} />
                )}
                {frameStyle === 'double' && (
                    <div className="inner-frame" style={{ borderColor: textColor }} />
                )}
                <div
                    className={`label-content-wrapper ${frameStyle !== 'none' ? `${frameStyle}-frame` : ''} ${textureClass}`}
                    style={{
                        background: bgColor,
                        color: textColor,
                        fontFamily: font,
                        width: '100%',
                        height: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <div
                        className={`label-text-display align-${textAlignment}`}
                        style={{
                            fontSize: `${Math.round(fontSize)}px`,
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            padding: frameStyle === 'double'
                                ? `${Math.max(8, labelHeight * 0.08)}px ${Math.max(12, labelWidth * 0.08)}px`
                                : frameStyle === 'single'
                                    ? `${Math.max(3, labelHeight * 0.02)}px ${Math.max(5, labelWidth * 0.03)}px` // Single frame için daha da azaltıldı
                                    : `${Math.max(10, labelHeight * 0.09)}px ${Math.max(12, labelWidth * 0.08)}px`, // No frame için dikey padding arttırıldı
                            margin: '0 !important',
                            lineHeight: 1,
                            boxSizing: 'border-box',
                            width: '100%',
                            height: '100%',
                            alignItems: textAlignment.startsWith('middle') ? 'center' : textAlignment.startsWith('top') ? 'flex-start' : 'flex-end',
                            justifyContent: textAlignment.endsWith('center') ? 'center' : textAlignment.endsWith('left') ? 'flex-start' : 'flex-end',
                        }}
                    >
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: `${Math.max(2, Math.round(fontSize * 0.2))}px`,
                            textAlign: 'center',
                            maxWidth: availableWidth,
                            maxHeight: availableHeight,
                            overflow: 'hidden',
                            whiteSpace: 'normal',
                            lineHeight: 1,
                        }}
                    >
                        {(iconPosition === 'left' || iconPosition === 'both') && iconEl}
                        <span
                            className="label-content"
                            style={{
                                display: 'inline-block',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                textAlign: 'center',
                                whiteSpace: 'normal',
                                lineHeight: 1,
                            }}
                        >
                            {content}
                        </span>
                        {(iconPosition === 'right' || iconPosition === 'both') && iconEl}
                    </span>
                    </div>
                </div>
                <div className="size-indicator">
                    <div className="width-indicator">{`${labelWidth}mm`}</div>
                    <div className="height-indicator">{`${labelHeight}mm`}</div>
                    <div className="dimension-line width-line" />
                    <div className="dimension-line height-line" />
                </div>
                {applicationMethod !== 'iron-on' && (
                    <div className="seam-allowance-indicators">
                        <div className="seam-allowance left">
                            <div className="seam-fold-line" />
                            <div className="seam-measurement">8mm</div>
                        </div>
                        <div className="seam-allowance right">
                            <div className="seam-fold-line" />
                            <div className="seam-measurement">8mm</div>
                        </div>
                    </div>
                )}
            </div>
        );
    }, [text,bgColor, icon, frameStyle, textColor, font, fontSize, iconPosition, labelType, fabricType, selectedQuality, textAlignment, labelWidth, labelHeight, applicationMethod, calculateFrameOffsets]);

    useEffect(() => {
        // Sadece iconPosition 'none' olduğunda icon'u kaldır
        if (iconPosition === 'none') {
            setIcon('none');
        }
    }, [iconPosition]);


    useEffect(() => {
        // Icon seçildiğinde ve mevcut iconPosition 'none' ise
        if (icon !== 'none' && iconPosition === 'none') {
            setIconPosition('left');
        }
    }, [icon,iconPosition]);

    useEffect(() => {
        if (labelType === 'printed') {
            setBgColor(fabricType === 'organic-cotton' ? '#F5F5DC' : '#FFFFFF');
            setApplicationMethod('sew-on');
        } else if (labelType === 'woven') {
            setBgColor('#FFFFFF');
        }
    }, [labelType, fabricType]);

    useEffect(() => {
        if (labelRef.current) {
            const wrapper = labelRef.current.querySelector('.label-content-wrapper');
            if (wrapper) {
                wrapper.style.background = bgColor;
            }
        }
    }, [bgColor]);

    const prices = useMemo(() => calculatePrice(), [calculatePrice]);

    const calculateContrastRatio = (color1, color2) => {
        const hexToRgb = (hex) => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16),
                }
                : { r: 0, g: 0, b: 0 };
        };

        // Renklerin RGB değerlerini al
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);

        // Renk farklılığını hesapla (Delta E)
        const calculateDeltaE = (rgb1, rgb2) => {
            // RGB'den LAB renk uzayına dönüşüm için yardımcı fonksiyonlar
            const rgbToXyz = (r, g, b) => {
                r = r / 255;
                g = g / 255;
                b = b / 255;

                r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
                g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
                b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

                r = r * 100;
                g = g * 100;
                b = b * 100;

                const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
                const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
                const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

                return [x, y, z];
            };

            const xyzToLab = (x, y, z) => {
                x = x / 95.047;
                y = y / 100;
                z = z / 108.883;

                x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
                y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
                z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

                const l = (116 * y) - 16;
                const a = 500 * (x - y);
                const b = 200 * (y - z);

                return [l, a, b];
            };

            // RGB'den LAB'a dönüşüm
            const [x1, y1, z1] = rgbToXyz(rgb1.r, rgb1.g, rgb1.b);
            const [x2, y2, z2] = rgbToXyz(rgb2.r, rgb2.g, rgb2.b);

            const [l1, a1, b1] = xyzToLab(x1, y1, z1);
            const [l2, a2, b2] = xyzToLab(x2, y2, z2);

            // Delta E hesaplama (CIE76 formülü)
            return Math.sqrt(
                Math.pow(l2 - l1, 2) +
                Math.pow(a2 - a1, 2) +
                Math.pow(b2 - b1, 2)
            );
        };

        // Renk farklılığını hesapla
        const deltaE = calculateDeltaE(rgb1, rgb2);

        // Renk parlaklık farkını hesapla
        const getBrightness = (rgb) => {
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        };

        const brightness1 = getBrightness(rgb1);
        const brightness2 = getBrightness(rgb2);
        const brightnessDiff = Math.abs(brightness1 - brightness2);

        // Sonuç objesi
        return {
            deltaE: deltaE,
            brightnessDiff: brightnessDiff,
            isSimilar: deltaE < 30, // Renklerin benzerliği için eşik değeri
            isLowContrast: brightnessDiff < 50, // Düşük kontrast için eşik değeri
            needsWarning: deltaE < 30 && brightnessDiff < 50 // Her iki koşul da sağlanıyorsa uyarı gerekir
        };
    };

    const checkColors = (newTextColor, newBgColor, setColorCallback, colorToSet) => {
        if (newTextColor === newBgColor) {
            setOverlay({
                show: true,
                message: 'Text color and background color cannot be the same!',
                onConfirm: null,
            });
            return false;
        }

        const contrast = calculateContrastRatio(newTextColor, newBgColor);

        if (contrast.needsWarning) {
            setOverlay({
                show: true,
                message: `Warning: The selected colors are too similar and may be hard to read.
                     Do you want to proceed anyway?`,
                onConfirm: () => setColorCallback(colorToSet),
            });
            return false;
        }

        return true;
    };

    return (
        <div className="label-designer-wrapper">
            <div className="designer-container">
                <div className="designer-controls">
                    <div className="control-group">
                        <div className="group-title">
                            Label Type
                            <span className="help-icon">?
                                <span className="tooltip">
                                    Choose between woven or printed labels. Woven labels are more durable and premium, while printed labels are more economical.
                                </span>
                            </span>
                        </div>
                        <div className="label-type-buttons">
                            {[
                                { value: 'printed', preview: 'PRINTED' },
                                { value: 'woven', preview: 'WOVEN' }
                            ].map(type => (
                                <button
                                    key={type.value}
                                    className={`label-type-button ${labelType === type.value ? 'selected' : ''}`}
                                    onClick={() => setLabelType(type.value)}
                                >
                                    <div className={`type-preview ${type.value}-preview`}>
                                        <div className="preview-border">
                                            <div className="preview-content">
                                                <span>{type.preview}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="type-label">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {labelType === 'printed' && (
                        <div className="control-group">
                            <div className="group-title">Fabric Type</div>
                            <div className="fabric-type-buttons">
                                {[
                                    { value: 'satin', title: 'Satin', desc: 'Smooth finish' },
                                    { value: 'edge-satin', title: 'Edge Satin', desc: 'Knitted edges' },
                                    { value: 'white-cotton', title: 'White Cotton', desc: 'Natural feel' },
                                    { value: 'organic-cotton', title: 'Organic Cotton', desc: 'Eco-friendly' }
                                ].map(fabric => (
                                    <button
                                        key={fabric.value}
                                        className={`fabric-type-button ${fabric.value} ${fabricType === fabric.value ? 'selected' : ''}`}
                                        onClick={() => setFabricType(fabric.value)}
                                    >
                                        <div className="fabric-icon"></div>
                                        <div className="fabric-info">
                                            <span className="fabric-title">{fabric.title}</span>
                                            <span className="fabric-desc">{fabric.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {labelType === 'woven' && (
                        <div className="control-group">
                            <div className="group-title">
                                Quality
                                <span className="help-icon">?
                                    <span className="tooltip">
                                        Select the quality level that best suits your needs. Higher quality affects durability and price per piece.
                                    </span>
                                </span>
                            </div>
                            <div className="quality-options">
                                {[
                                    { value: 'eco', title: 'Eco', desc: 'Budget friendly option' },
                                    { value: 'standard', title: 'Standard', desc: 'Balanced quality choice' },
                                    { value: 'premium', title: 'Premium', desc: 'Superior durability' }
                                ].map(quality => (
                                    <button
                                        key={quality.value}
                                        className={`quality-button ${quality.value} ${selectedQuality === quality.value ? 'selected' : ''}`}
                                        onClick={() => setSelectedQuality(quality.value)}
                                    >
                                        <div className="quality-icon"></div>
                                        <div className="quality-info">
                                            <span className="quality-title">{quality.title}</span>
                                            <span className="quality-desc">{quality.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="control-group">
                        <div className="group-title">
                            Label Size
                            <span className="help-icon">?
                                <span className="tooltip">
                                    Select the dimensions of your label. Standard sizes are optimized for different garment types and locations.
                                </span>
                            </span>
                        </div>
                        <div className="size-options">
                            {sizeOptions.map(size => (
                                <div
                                    key={size.name}
                                    className={`size-option ${labelWidth === size.width && labelHeight === size.height ? 'selected' : ''}`}
                                    onClick={() => { setLabelWidth(size.width); setLabelHeight(size.height); }}
                                >
                                    <div className="size-preview">
                                        <div className="size-box" style={{ width: `${size.width * 0.8}px`, height: `${size.height * 0.8}px` }} />
                                    </div>
                                    <div className="size-details">
                                        <div className="size-name">{size.name}</div>
                                        <div className="size-dimensions">{`${size.width}x${size.height}mm`}</div>
                                        <div className="size-info">{size.info}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Label Text
                            <span className="help-icon">?
                                <span className="tooltip">
                                    Enter the text that will appear on your label. You can adjust the font size and style to match your design needs.
                                </span>
                            </span>
                        </div>
                        <div className="text-control-wrapper">
                            <input
                                type="text"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                className="label-text-input"
                                placeholder="Enter label text"
                                maxLength={70}
                            />
                            <div className="font-size-control">
                                <label>Font Size: {Math.round(fontSize)}px</label>
                                <input
                                    type="range"
                                    min={getFontSizeRange().min}
                                    max={getFontSizeRange().max}
                                    value={fontSize}
                                    onChange={e => setFontSize(Number(e.target.value))}
                                    step="1"
                                    className="range-slider"
                                />
                            </div>
                            <div className="control-group">
                                <div className="group-title">
                                    Text Alignment
                                    <span className="help-icon">?
                                        <span className="tooltip">
                                            Control how your text is positioned on the label. Choose from 9 different alignment options for perfect placement.
                                        </span>
                                    </span>
                                </div>
                                <div className="text-alignment-grid">
                                    {alignmentOptions.map(align => (
                                        <button
                                            key={align.value}
                                            className={`alignment-button ${textAlignment === align.value ? 'selected' : ''}`}
                                            onClick={() => setTextAlignment(align.value)}
                                        >
                                            <div className="alignment-preview">
                                                <div className={`alignment-bar ${align.value}`}>
                                                    <span className="alignment-text">{align.preview}</span>
                                                </div>
                                            </div>
                                            <span className="alignment-label">{align.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Font Style
                            <span className="help-icon">?
            <span className="tooltip">
                Choose from a variety of fonts to customize your label's appearance.
            </span>
        </span>
                        </div>
                        <div className="font-category-section">
                            <button
                                className="scroll-button left"
                                onClick={() => scrollFontCategories('left')}
                                disabled={fontScrollPosition <= 0}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <div className="font-category-slider" ref={fontCategorySliderRef}>
                                {Object.entries(fontCategories).map(([category, fonts]) => (
                                    <button
                                        key={category}
                                        className={`font-category-button ${fontCategory === category ? 'active' : ''}`}
                                        onClick={() => setFontCategory(category)}
                                    >
                    <span
                        className="font-preview-text"
                        style={{ fontFamily: fonts[0] }}
                    >
                        Aa
                    </span>
                                        <span className="font-category-name">{category}</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                className="scroll-button right"
                                onClick={() => scrollFontCategories('right')}
                                disabled={fontScrollPosition >= (fontCategorySliderRef.current?.scrollWidth - fontCategorySliderRef.current?.clientWidth)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                        <div className="font-options-grid">
                            {fontCategories[fontCategory].map(fontName => (
                                <button
                                    key={fontName}
                                    className={`font-option ${font === fontName ? 'selected' : ''}`}
                                    style={{ fontFamily: fontName }}
                                    onClick={() => setFont(fontName)}
                                >
                                    <span className="font-preview">Aa</span>
                                    <span className="font-name">{fontName}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Icon & Position
                            <span className="help-icon">?
                                <span className="tooltip">
                                    Add decorative icons to enhance your label design. Icons can be placed on either side or both sides of the text.
                                </span>
                            </span>
                        </div>
                        <div className="icon-position-options">
                            {iconPositions.map(pos => (
                                <button
                                    key={pos.value}
                                    className={`position-button ${iconPosition === pos.value ? 'selected' : ''}`}
                                    onClick={() => setIconPosition(pos.value)}
                                >
                                    <div className="position-preview">
                                        <div className="preview-frame">
                                            <span className="preview-text">{pos.preview}</span>
                                        </div>
                                    </div>
                                    <span className="position-label">{pos.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="icon-category-section">
                            <button
                                className="scroll-button left"
                                onClick={() => scrollCategories('left')}
                                disabled={scrollPosition <= 0}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <div className="icon-category-slider" ref={categorySliderRef}>
                                {iconCategories.map(category => (
                                    <button
                                        key={category.name}
                                        className={`icon-category-button ${iconCategory === category.name ? 'active' : ''}`}
                                        onClick={() => setIconCategory(category.name)}
                                    >
                                        <span className="category-icon">
                                            <Icon name={category.icon} color="#000000" />
                                        </span>
                                        <span className="category-name">{category.name}</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                className="scroll-button right"
                                onClick={() => scrollCategories('right')}
                                disabled={scrollPosition >= (categorySliderRef.current?.scrollWidth - categorySliderRef.current?.clientWidth)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                        <div className="icon-options-grid">
                            {displayedIcons.map((iconName) => (
                                <button
                                    key={iconName}
                                    className={`icon-option ${icon === iconName ? 'selected' : ''}`}
                                    onClick={() => setIcon(iconName)}
                                >
                                    <span className="icon-preview">
                                        <Icon name={iconName} color={textColor} size={24} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Frame Style
                            <span className="help-icon">?
                                <span className="tooltip">
                                    Add decorative frames around your text. Choose from single, double, or no frame to suit your design style.
                                </span>
                            </span>
                        </div>
                        <div className="frame-style-buttons">
                            {['none', 'single', 'double'].map(style => (
                                <button
                                    key={style}
                                    className={`frame-button ${frameStyle === style ? 'selected' : ''}`}
                                    onClick={() => setFrameStyle(style)}
                                >
                                    <div className={`frame-preview ${style}-frame`}>
                                        <div className="preview-content"></div>
                                    </div>
                                    <span>{style === 'none' ? 'No Frame' : `${style.charAt(0).toUpperCase() + style.slice(1)} Frame`}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Colors
                            <span className="help-icon">?
                                <span className="tooltip">
                                    Select background and text colors for your label. For optimal readability, ensure sufficient contrast between background and text colors. Avoid using the same color for both. Our system will help you select compatible color combinations.
                                </span>
                            </span>
                        </div>
                        <div className="color-options-wrapper">
                            <div className="color-section">
                                <label>Text Color</label>
                                <div className="color-section-wrapper">
                                    <div className="color-palette">
                                        {colorPalette.map(color => (
                                            <button
                                                key={`text-${color}`}
                                                className={`color-swatch ${textColor === color ? 'selected' : ''}`}
                                                style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #E5E7EB' : 'none' }}
                                                onClick={() => {
                                                    if (checkColors(color, bgColor, setTextColor, color)) {
                                                        setTextColor(color);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {labelType === 'woven' && (
                                <div className="color-section">
                                    <label>Background Color</label>
                                    <div className="color-section-wrapper">
                                        <div className="color-palette">
                                            {colorPalette.map(color => (
                                                <button
                                                    key={`bg-${color}`}
                                                    className={`color-swatch ${bgColor === color ? 'selected' : ''}`}
                                                    style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #E5E7EB' : 'none' }}
                                                    onClick={() => {
                                                        if (checkColors(textColor, color, setBgColor, color)) {
                                                            setBgColor(color);
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {labelType === 'woven' && (
                        <>
                            <div className="control-group">
                                <div className="group-title">
                                    Application Method
                                    <span className="help-icon">?
                                        <span className="tooltip">
                                            Choose how the label will be attached: sew-on for traditional application or iron-on for heat application.
                                        </span>
                                    </span>
                                </div>
                                <div className="application-options">
                                    <button
                                        className={`application-button sew-on ${applicationMethod === 'sew-on' ? 'selected' : ''}`}
                                        onClick={() => setApplicationMethod('sew-on')}
                                    >
                                        <div className="method-icon">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M6 18 L12 6 M12 6 L18 18 M12 6 L12 12" stroke="currentColor" stroke-width="2" fill="none"/>
                                                <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                        </div>
                                        <div className="application-info">
                                            <span className="application-title">Sew-on</span>
                                            <span className="application-desc">Traditional method</span>
                                        </div>
                                    </button>
                                    <button
                                        className={`application-button iron-on ${applicationMethod === 'iron-on' ? 'selected' : ''}`}
                                        onClick={() => setApplicationMethod('iron-on')}
                                    >
                                        <div className="method-icon">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M4 16 L8 8 H16 L20 16 H4 Z" stroke="currentColor" stroke-width="2" fill="none"/>
                                                <path d="M10 12 H14 M10 14 H14" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                        </div>
                                        <div className="application-info">
                                            <span className="application-title">Iron-on</span>
                                            <span className="application-desc">Heat application</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="control-group">
                                <div className="group-title">
                                    Extra Options
                                    <span className="help-icon">?
                                        <span className="tooltip">
                                            Additional options like double backing for durability or ultrasonic cutting for clean edges.
                                        </span>
                                    </span>
                                </div>
                                <div className="extras-options">
                                    <button
                                        className={`extra-option-button standard ${!extras.zemindouble && !extras.ultrasonicCutting ? 'selected' : ''}`}
                                        onClick={() => setExtras({ zemindouble: false, ultrasonicCutting: false })}
                                    >
                                        <div className="method-icon">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M4 12 L9 17 L20 6" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                        </div>
                                        <div className="extra-info">
                                            <span className="extra-title">Standard</span>
                                            <span className="extra-desc">Basic finish</span>
                                        </div>
                                    </button>
                                    <button
                                        className={`extra-option-button double-back ${extras.zemindouble ? 'selected' : ''}`}
                                        onClick={() => setExtras(prev => ({ ...prev, zemindouble: !prev.zemindouble, ultrasonicCutting: false }))}
                                    >
                                        <div className="method-icon">
                                            <svg viewBox="0 0 24 24">
                                                <rect x="4" y="6" width="14" height="12" rx="2" transform="rotate(-10 11 12)" stroke="currentColor" stroke-width="2" fill="none"/>
                                                <rect x="6" y="6" width="14" height="12" rx="2" transform="rotate(10 13 12)" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                        </div>
                                        <div className="extra-info">
                                            <span className="extra-title">Double Back</span>
                                            <span className="extra-desc">Enhanced durability</span>
                                        </div>
                                    </button>
                                    <button
                                        className={`extra-option-button ultrasonic ${extras.ultrasonicCutting ? 'selected' : ''}`}
                                        onClick={() => setExtras(prev => ({ ...prev, ultrasonicCutting: !prev.ultrasonicCutting, zemindouble: false }))}
                                    >
                                        <div className="method-icon">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M6 8 A4 4 0 0 1 6 16 M4 6 A6 6 0 0 1 4 18" stroke="currentColor" stroke-width="2" fill="none"/>
                                                <path d="M16 6 L20 18" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                        </div>
                                        <div className="extra-info">
                                            <span className="extra-title">Ultrasonic</span>
                                            <span className="extra-desc">Clean edges</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="designer-canvas" style={{ height: 'auto', minHeight: '600px' }}>
                    <div className="preview-header">
                        <div className="dimensions">
                            <span className="actual-size">{`${labelWidth}x${labelHeight}mm`}</span>
                            {(labelType === 'woven' || labelType === 'printed') && applicationMethod !== 'iron-on' && (
                                <span className="seam-info"> (+ 8mm seam allowance)</span>
                            )}
                        </div>
                    </div>
                    <div className="canvas-frame">
                        <div
                            ref={labelRef}
                            className="label-preview"
                            style={{
                                width: `${labelWidth * calculateScaleFactor(labelWidth, labelHeight).widthScale}px`,
                                height: `${labelHeight * calculateScaleFactor(labelWidth, labelHeight).heightScale}px`
                            }}
                        >
                            {renderLabelContent()}
                        </div>
                    </div>
                    <div className="order-section">
                        <div className="quantity-selector">
                            <label htmlFor="quantity">Quantity</label>
                            <select
                                id="quantity"
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                disabled={loading}
                            >
                                {[1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000].map(q => (
                                    <option key={q} value={q}>{q} pieces</option>
                                ))}
                            </select>
                        </div>
                        <div className="price-info">
                            <div className="total-price">
                                <span>Total Price:</span>
                                <span className="amount">${prices.total}</span>
                            </div>
                            <div className="price-per-piece">${prices.perPiece} per piece</div>
                        </div>
                        <button
                            className={`add-to-cart-button ${loading ? 'loading' : ''}`}
                            onClick={addToCart}
                            disabled={loading || !text.trim()}
                        >
                            {loading ? 'Adding to Cart...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
            {overlay.show && (
                <div className="overlay">
                    <div className="overlay-content">
                        <p>{overlay.message}</p>
                        <div className="overlay-buttons">
                            {overlay.onConfirm ? (
                                <>
                                    <button
                                        className="overlay-button overlay-button-cancel"
                                        onClick={() => setOverlay({ show: false, message: '', onConfirm: null })}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="overlay-button overlay-button-confirm"
                                        onClick={() => {
                                            overlay.onConfirm();
                                            setOverlay({ show: false, message: '', onConfirm: null });
                                        }}
                                    >
                                        Confirm Anyway
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="overlay-button"
                                    onClick={() => setOverlay({ show: false, message: '', onConfirm: null })}
                                >
                                    OK
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
