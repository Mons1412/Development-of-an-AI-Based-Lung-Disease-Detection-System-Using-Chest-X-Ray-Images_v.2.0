"use strict";

(() => {
    const TEXT = {
        vi: {
            switchLabel: "EN",
            switchAria: "Chuy\u1ec3n sang ti\u1ebfng Anh",

            brandSubtitle: "Ph\u00e2n lo\u1ea1i \u1ea3nh X-quang ng\u1ef1c",
            heroEyebrow: "TR\u00ccNH DI\u1ec4N NGHI\u00caN C\u1ee8U AI",
            heroTitle: "Ph\u00e2n t\u00edch \u1ea3nh X-quang ng\u1ef1c",
            heroText: "T\u1ea3i l\u00ean m\u1ed9t \u1ea3nh X-quang ng\u1ef1c \u0111\u1ec3 tr\u1ea3i nghi\u1ec7m m\u00f4 h\u00ecnh ph\u00e2n lo\u1ea1i h\u00ecnh \u1ea3nh b\u1eb1ng tr\u00ed tu\u1ec7 nh\u00e2n t\u1ea1o.",

            normal: "B\u00ecnh th\u01b0\u1eddng",
            pneumonia: "Vi\u00eam ph\u1ed5i",
            tuberculosis: "Lao ph\u1ed5i",

            modelEyebrow: "H\u1ec6 TH\u1ed0NG AI",
            modelTitle: "Th\u00f4ng tin m\u00f4 h\u00ecnh",
            modelName: "T\u00ean m\u00f4 h\u00ecnh",
            architecture: "Ki\u1ebfn tr\u00fac",
            version: "Phi\u00ean b\u1ea3n",
            supportedClasses: "C\u00e1c l\u1edbp h\u1ed7 tr\u1ee3",
            available: "S\u1eb5n s\u00e0ng",
            unavailable: "Kh\u00f4ng kh\u1ea3 d\u1ee5ng",
            loading: "\u0110ang t\u1ea3i...",

            uploadEyebrow: "\u1ea2NH \u0110\u1ea6U V\u00c0O",
            uploadTitle: "T\u1ea3i \u1ea3nh X-quang ng\u1ef1c",
            max10: "T\u1ed1i \u0111a 10 MB",
            chooseImage: "Ch\u1ecdn \u1ea3nh X-quang ng\u1ef1c",
            chooseHint: "Nh\u1ea5n \u0111\u1ec3 ch\u1ecdn \u1ea3nh t\u1eeb thi\u1ebft b\u1ecb c\u1ee7a b\u1ea1n",
            formats: "JPEG ho\u1eb7c PNG \u00b7 T\u1ed1i \u0111a 10 MB",
            preview: "Xem tr\u01b0\u1edbc \u1ea3nh",
            analyze: "Ph\u00e2n t\u00edch \u1ea3nh",
            analyzing: "\u0110ang ph\u00e2n t\u00edch...",
            clear: "X\u00f3a",

            resultEyebrow: "SUY LU\u1eacN AI",
            resultTitle: "K\u1ebft qu\u1ea3 ph\u00e2n t\u00edch",
            completed: "Ho\u00e0n t\u1ea5t",
            predictedClass: "L\u1edbp d\u1ef1 \u0111o\u00e1n",
            confidence: "\u0110\u1ed9 tin c\u1eady c\u1ee7a m\u00f4 h\u00ecnh",
            probabilities: "X\u00e1c su\u1ea5t theo l\u1edbp",
            probabilityDescription: "C\u00e1c x\u00e1c su\u1ea5t \u0111\u1ea7u ra do m\u00f4 h\u00ecnh ph\u00e2n lo\u1ea1i t\u1ea1o ra.",
            analysisInfo: "Th\u00f4ng tin ph\u00e2n t\u00edch",
            imageFormat: "\u0110\u1ecbnh d\u1ea1ng \u1ea3nh",
            imageDimensions: "K\u00edch th\u01b0\u1edbc \u1ea3nh",
            modelVersion: "Phi\u00ean b\u1ea3n m\u00f4 h\u00ecnh",
            resultDisclaimer: "C\u00e1c k\u1ebft qu\u1ea3 tr\u00ean l\u00e0 \u0111\u1ea7u ra c\u1ee7a m\u00f4 h\u00ecnh AI, kh\u00f4ng ph\u1ea3i k\u1ebft lu\u1eadn ch\u1ea9n \u0111o\u00e1n y khoa.",

            medicalTitle: "L\u01b0u \u00fd y t\u1ebf",
            medical1: "LungXrayAI 1.0 l\u00e0 s\u1ea3n ph\u1ea9m nghi\u00ean c\u1ee9u v\u00e0 tr\u00ecnh di\u1ec5n c\u00f4ng ngh\u1ec7 tr\u00ed tu\u1ec7 nh\u00e2n t\u1ea1o. H\u1ec7 th\u1ed1ng ch\u1ec9 ph\u00e2n lo\u1ea1i \u1ea3nh th\u00e0nh B\u00ecnh th\u01b0\u1eddng, Vi\u00eam ph\u1ed5i v\u00e0 Lao ph\u1ed5i.",
            medical2: "K\u1ebft qu\u1ea3 v\u00e0 c\u00e1c gi\u00e1 tr\u1ecb x\u00e1c su\u1ea5t kh\u00f4ng \u0111\u1ea1i di\u1ec7n cho x\u00e1c su\u1ea5t th\u1ef1c t\u1ebf m\u1ed9t ng\u01b0\u1eddi m\u1eafc b\u1ec7nh. \u0110\u00e2y kh\u00f4ng ph\u1ea3i c\u00f4ng c\u1ee5 ch\u1ea9n \u0111o\u00e1n y khoa v\u00e0 kh\u00f4ng thay th\u1ebf vi\u1ec7c th\u0103m kh\u00e1m, t\u01b0 v\u1ea5n ho\u1eb7c k\u1ebft lu\u1eadn c\u1ee7a b\u00e1c s\u0129.",
            medical3: "Kh\u00f4ng s\u1eed d\u1ee5ng k\u1ebft qu\u1ea3 n\u00e0y l\u00e0m c\u0103n c\u1ee9 duy nh\u1ea5t cho quy\u1ebft \u0111\u1ecbnh \u0111i\u1ec1u tr\u1ecb.",

            privacy: "Quy\u1ec1n ri\u00eang t\u01b0 Guest: \u1ea2nh v\u00e0 k\u1ebft qu\u1ea3 ph\u00e2n t\u00edch Guest kh\u00f4ng \u0111\u01b0\u1ee3c l\u01b0u v\u00e0o database. Trang demo kh\u00f4ng s\u1eed d\u1ee5ng LocalStorage ho\u1eb7c SessionStorage \u0111\u1ec3 l\u01b0u \u1ea3nh hay k\u1ebft qu\u1ea3.",

            footer1: "LungXrayAI 1.0 \u00b7 Tr\u00ecnh di\u1ec5n Guest",
            footer2: "Ch\u1ec9 ph\u1ee5c v\u1ee5 m\u1ee5c \u0111\u00edch nghi\u00ean c\u1ee9u v\u00e0 gi\u00e1o d\u1ee5c.",

            selected: "\u1ea2nh \u0111\u00e3 \u0111\u01b0\u1ee3c ch\u1ecdn. H\u00e3y ki\u1ec3m tra \u1ea3nh tr\u01b0\u1edbc khi ph\u00e2n t\u00edch.",
            checking: "\u0110ang ki\u1ec3m tra k\u00edch th\u01b0\u1edbc \u1ea3nh...",
            sending: "\u0110ang g\u1eedi \u1ea3nh v\u00e0 th\u1ef1c hi\u1ec7n ph\u00e2n t\u00edch b\u1eb1ng m\u00f4 h\u00ecnh AI. Vui l\u00f2ng ch\u1edd...",
            finished: "Ph\u00e2n t\u00edch ho\u00e0n t\u1ea5t. Vui l\u00f2ng \u0111\u1ecdc k\u1ef9 th\u00f4ng tin v\u00e0 l\u01b0u \u00fd y t\u1ebf.",
            notChest: "\u1ea2nh kh\u00f4ng ph\u1ea3i \u1ea3nh X-quang ng\u1ef1c.",
            busy: "H\u1ec7 th\u1ed1ng AI hi\u1ec7n \u0111ang b\u1eadn ho\u1eb7c t\u1ea1m th\u1eddi kh\u00f4ng kh\u1ea3 d\u1ee5ng."
        },

        en: {
            switchLabel: "VI",
            switchAria: "Switch to Vietnamese",

            brandSubtitle: "Chest X-ray Classification",
            heroEyebrow: "AI RESEARCH DEMONSTRATION",
            heroTitle: "Chest X-ray Analysis",
            heroText: "Upload one chest X-ray image to try the AI image-classification model.",

            normal: "Normal",
            pneumonia: "Pneumonia",
            tuberculosis: "Tuberculosis",

            modelEyebrow: "AI SYSTEM",
            modelTitle: "Model Information",
            modelName: "Model name",
            architecture: "Architecture",
            version: "Version",
            supportedClasses: "Supported classes",
            available: "Available",
            unavailable: "Unavailable",
            loading: "Loading...",

            uploadEyebrow: "IMAGE INPUT",
            uploadTitle: "Upload Chest X-ray",
            max10: "Maximum 10 MB",
            chooseImage: "Choose a chest X-ray image",
            chooseHint: "Click to select an image from your device",
            formats: "JPEG or PNG \u00b7 Maximum 10 MB",
            preview: "Image Preview",
            analyze: "Analyze Image",
            analyzing: "Analyzing...",
            clear: "Clear",

            resultEyebrow: "AI INFERENCE",
            resultTitle: "Analysis Results",
            completed: "Completed",
            predictedClass: "Predicted Class",
            confidence: "Model confidence",
            probabilities: "Class Probabilities",
            probabilityDescription: "Output probabilities generated by the classification model.",
            analysisInfo: "Analysis Information",
            imageFormat: "Image format",
            imageDimensions: "Image dimensions",
            modelVersion: "Model version",
            resultDisclaimer: "The results above are AI model outputs and are not a medical diagnosis.",

            medicalTitle: "Medical Disclaimer",
            medical1: "LungXrayAI 1.0 is a research and artificial-intelligence technology demonstration. The system only classifies images as Normal, Pneumonia, or Tuberculosis.",
            medical2: "The results and probability values do not represent a person's real probability of having a disease. This is not a medical diagnostic tool and does not replace examination, consultation, or conclusions from a qualified clinician.",
            medical3: "Do not use this result as the sole basis for treatment decisions.",

            privacy: "Guest privacy: Guest images and analysis results are not stored in the database. This demo does not use LocalStorage or SessionStorage to store images or results.",

            footer1: "LungXrayAI 1.0 \u00b7 Guest Demonstration",
            footer2: "Research and educational purposes only.",

            selected: "Image selected. Please review it before analysis.",
            checking: "Checking image dimensions...",
            sending: "Uploading the image and running AI analysis. Please wait...",
            finished: "Analysis completed. Please read the result and medical disclaimer carefully.",
            notChest: "Image does not appear to be a chest X-ray.",
            busy: "The AI system is busy or temporarily unavailable."
        }
    };

    let language = "vi";
    let languageButton = null;

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);
    const text = (selector, value) => {
        const element = $(selector);
        if (element) element.textContent = value;
    };

    function classLabel(value) {
        const normalized = String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[\s_-]+/g, "");

        if (normalized === "normal" || normalized === "b\u00ecnhth\u01b0\u1eddng") {
            return TEXT[language].normal;
        }

        if (normalized === "pneumonia" || normalized === "vi\u00eamph\u1ed5i") {
            return TEXT[language].pneumonia;
        }

        if (normalized === "tuberculosis" || normalized === "laoph\u1ed5i") {
            return TEXT[language].tuberculosis;
        }

        return value;
    }

    function applyStaticText() {
        const t = TEXT[language];

        document.documentElement.lang = language;

        if (languageButton) {
            languageButton.textContent = t.switchLabel;
            languageButton.setAttribute("aria-label", t.switchAria);
            languageButton.title = t.switchAria;
        }

        text(".brand-subtitle", t.brandSubtitle);
        text(".hero-eyebrow", t.heroEyebrow);
        text(".hero h1", t.heroTitle);
        text(".hero > p", t.heroText);

        const heroTags = $$(".hero-tags span");
        if (heroTags[0]) heroTags[0].textContent = t.normal;
        if (heroTags[1]) heroTags[1].textContent = t.pneumonia;
        if (heroTags[2]) heroTags[2].textContent = t.tuberculosis;

        text(".model-card .section-eyebrow", t.modelEyebrow);
        text(".model-card .section-heading h2", t.modelTitle);

        const modelLabels = $$(".model-grid .field-label");
        if (modelLabels[0]) modelLabels[0].textContent = t.modelName;
        if (modelLabels[1]) modelLabels[1].textContent = t.architecture;
        if (modelLabels[2]) modelLabels[2].textContent = t.version;

        text(".class-section > .field-label", t.supportedClasses);

        text(".upload-card .section-eyebrow", t.uploadEyebrow);
        text(".upload-card .section-heading h2", t.uploadTitle);
        text(".limit-badge", t.max10);
        text("#upload-zone > strong", t.chooseImage);

        const uploadSpans = $$("#upload-zone > span");
        if (uploadSpans[0]) uploadSpans[0].textContent = t.chooseHint;
        if (uploadSpans[1]) uploadSpans[1].textContent = t.formats;

        const fileInput = $("#guest-file");
        if (fileInput) {
            fileInput.setAttribute(
                "aria-label",
                language === "vi"
                    ? "Ch\u1ecdn \u1ea3nh X-quang ng\u1ef1c"
                    : "Choose a chest X-ray image"
            );
        }

        text(".preview-heading strong", t.preview);
        text("#clear-button", t.clear);

        text("#result-section .section-eyebrow", t.resultEyebrow);
        text("#result-section .section-heading h2", t.resultTitle);
        text(".result-badge", t.completed);
        text(".prediction-panel > .field-label", t.predictedClass);
        text(".confidence-line span", t.confidence);
        text(".probability-section h3", t.probabilities);
        text(".probability-section .section-description", t.probabilityDescription);
        text(".result-metadata h3", t.analysisInfo);

        const metadataLabels = $$(".metadata-grid .field-label");
        if (metadataLabels[0]) metadataLabels[0].textContent = t.imageFormat;
        if (metadataLabels[1]) metadataLabels[1].textContent = t.imageDimensions;
        if (metadataLabels[2]) metadataLabels[2].textContent = t.modelVersion;

        text(".result-disclaimer", t.resultDisclaimer);

        text(".disclaimer-card h2", t.medicalTitle);

        const disclaimerParagraphs = $$(".disclaimer-card p");
        if (disclaimerParagraphs[0]) disclaimerParagraphs[0].textContent = t.medical1;
        if (disclaimerParagraphs[1]) disclaimerParagraphs[1].textContent = t.medical2;
        if (disclaimerParagraphs[2]) disclaimerParagraphs[2].textContent = t.medical3;

        text(".privacy-note p", t.privacy);

        const footer = $$(".site-footer p");
        if (footer[0]) footer[0].textContent = t.footer1;
        if (footer[1]) footer[1].textContent = t.footer2;
    }

    function translateDynamicText() {
        const t = TEXT[language];

        const modelStatus = $("#model-status");

        if (modelStatus) {
            const value = modelStatus.textContent.trim();

            if ([
                "Available",
                "S\u1eb5n s\u00e0ng"
            ].includes(value)) {
                modelStatus.textContent = t.available;
            } else if ([
                "Unavailable",
                "Kh\u00f4ng kh\u1ea3 d\u1ee5ng"
            ].includes(value)) {
                modelStatus.textContent = t.unavailable;
            } else if (
                value.includes("Loading") ||
                value.includes("\u0110ang t\u1ea3i")
            ) {
                modelStatus.textContent = t.loading;
            }
        }

        const analyzeButtonText = $("#analyze-button-text");

        if (analyzeButtonText) {
            const value = analyzeButtonText.textContent.trim();

            if (
                value === "Analyzing..." ||
                value === "\u0110ang ph\u00e2n t\u00edch..."
            ) {
                analyzeButtonText.textContent = t.analyzing;
            } else {
                analyzeButtonText.textContent = t.analyze;
            }
        }

        $$(".class-chip, .probability-label span, #predicted-class")
            .forEach((element) => {
                const translated = classLabel(element.textContent);
                if (translated) element.textContent = translated;
            });

        const dimensions = $("#image-dimensions");

        if (dimensions) {
            const value = dimensions.textContent.trim();

            if (
                value.includes("\u0110ang ki\u1ec3m tra") ||
                value.includes("Checking image dimensions")
            ) {
                dimensions.textContent = t.checking;
            }
        }

        const status = $("#request-status");

        if (status && !status.hidden) {
            const value = status.textContent.trim();

            const groups = [
                {
                    values: [
                        "\u1ea2nh \u0111\u00e3 \u0111\u01b0\u1ee3c ch\u1ecdn. H\u00e3y ki\u1ec3m tra \u1ea3nh tr\u01b0\u1edbc khi ph\u00e2n t\u00edch.",
                        "Image selected. Please review it before analysis."
                    ],
                    output: t.selected
                },
                {
                    values: [
                        "\u0110ang g\u1eedi \u1ea3nh v\u00e0 th\u1ef1c hi\u1ec7n ph\u00e2n t\u00edch b\u1eb1ng m\u00f4 h\u00ecnh AI. Vui l\u00f2ng ch\u1edd...",
                        "Uploading the image and running AI analysis. Please wait..."
                    ],
                    output: t.sending
                },
                {
                    values: [
                        "Ph\u00e2n t\u00edch ho\u00e0n t\u1ea5t. Vui l\u00f2ng \u0111\u1ecdc k\u1ef9 th\u00f4ng tin v\u00e0 l\u01b0u \u00fd y t\u1ebf.",
                        "Analysis completed. Please read the result and medical disclaimer carefully."
                    ],
                    output: t.finished
                },
                {
                    values: [
                        "Image does not appear to be a chest X-ray.",
                        "\u1ea2nh kh\u00f4ng ph\u1ea3i \u1ea3nh X-quang ng\u1ef1c."
                    ],
                    output: t.notChest
                },
                {
                    values: [
                        "H\u1ec7 th\u1ed1ng AI hi\u1ec7n \u0111ang b\u1eadn ho\u1eb7c t\u1ea1m th\u1eddi kh\u00f4ng kh\u1ea3 d\u1ee5ng.",
                        "The AI system is busy or temporarily unavailable."
                    ],
                    output: t.busy
                }
            ];

            for (const group of groups) {
                if (group.values.includes(value)) {
                    status.textContent = group.output;
                    break;
                }
            }
        }
    }

    function applyLanguage() {
        applyStaticText();
        translateDynamicText();
    }

    function installSwitch() {
        const header = $(".header-inner");
        const badge = $(".guest-badge");

        if (!header || !badge) return;

        const actions = document.createElement("div");
        actions.className = "header-actions";

        languageButton = document.createElement("button");
        languageButton.type = "button";
        languageButton.className = "language-switch";

        header.replaceChild(actions, badge);
        actions.append(languageButton, badge);

        languageButton.addEventListener("click", () => {
            language = language === "vi" ? "en" : "vi";
            applyLanguage();
        });
    }

    const observer = new MutationObserver(() => {
        translateDynamicText();
    });

    installSwitch();
    applyLanguage();

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
})();