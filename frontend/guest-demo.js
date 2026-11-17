"use strict";

(() => {

    const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);
    const API = LOCAL_HOSTS.has(window.location.hostname)
        ? "/api/v1/guest"
        : "https://lungxrayai1-guest.onrender.com/api/v1/guest";
    const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

    const ALLOWED_TYPES = new Set([
        "image/jpeg",
        "image/png",
    ]);

    const ALLOWED_EXTENSIONS = new Set([
        "jpg",
        "jpeg",
        "png",
    ]);

    const CLASS_LABELS = {
        normal: "Normal",
        pneumonia: "Pneumonia",
        tuberculosis: "Tuberculosis",
    };

    const elements = {
        modelStatus: document.getElementById("model-status"),
        modelName: document.getElementById("model-name"),
        modelArchitecture: document.getElementById("model-architecture"),
        modelVersion: document.getElementById("model-version"),
        modelClasses: document.getElementById("model-classes"),

        fileInput: document.getElementById("guest-file"),
        uploadZone: document.getElementById("upload-zone"),

        previewSection: document.getElementById("preview-section"),
        previewImage: document.getElementById("preview-image"),
        fileName: document.getElementById("file-name"),
        fileSize: document.getElementById("file-size"),
        imageDimensions: document.getElementById("image-dimensions"),

        analyzeButton: document.getElementById("analyze-button"),
        analyzeButtonText: document.getElementById("analyze-button-text"),
        clearButton: document.getElementById("clear-button"),

        requestStatus: document.getElementById("request-status"),

        resultSection: document.getElementById("result-section"),
        predictedClass: document.getElementById("predicted-class"),
        predictionConfidence: document.getElementById("prediction-confidence"),
        probabilityList: document.getElementById("probability-list"),

        resultFormat: document.getElementById("result-format"),
        resultDimensions: document.getElementById("result-dimensions"),
        resultModelVersion: document.getElementById("result-model-version"),
    };

    let selectedFile = null;
    let previewUrl = null;
    let modelInfo = null;
    let isAnalyzing = false;

    function setStatus(message, type = "info") {

        elements.requestStatus.textContent = message;

        elements.requestStatus.className =
            `request-status status-${type}`;

        elements.requestStatus.hidden = false;
    }

    function hideStatus() {

        elements.requestStatus.hidden = true;
        elements.requestStatus.textContent = "";
    }

    function formatClassLabel(value) {

        const normalized = String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[\s_-]+/g, "");

        return CLASS_LABELS[normalized]
            || String(value || "Unknown");
    }

    function formatPercent(value) {

        return new Intl.NumberFormat("vi-VN", {
            style: "percent",
            maximumFractionDigits: 2,
        }).format(value);
    }

    function formatBytes(bytes) {

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    function updateButtons() {

        elements.analyzeButton.disabled =
            !selectedFile || isAnalyzing;

        elements.clearButton.disabled =
            !selectedFile || isAnalyzing;

        elements.fileInput.disabled = isAnalyzing;
    }

    function releasePreview() {

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            previewUrl = null;
        }

        elements.previewImage.removeAttribute("src");
    }

    function clearResult() {

        elements.resultSection.hidden = true;

        elements.predictedClass.textContent = "";
        elements.predictionConfidence.textContent = "";

        elements.probabilityList.replaceChildren();
    }

    function resetSelection() {

        selectedFile = null;

        releasePreview();

        elements.fileInput.value = "";
        elements.previewSection.hidden = true;

        elements.fileName.textContent = "";
        elements.fileSize.textContent = "";
        elements.imageDimensions.textContent = "";

        clearResult();
        hideStatus();

        updateButtons();
    }

    function validateFile(file) {

        if (!file) {
            return "Vui lòng chọn một ảnh.";
        }

        if (file.size === 0) {
            return "File ảnh đang trống.";
        }

        if (file.size > MAX_IMAGE_BYTES) {
            return "Ảnh vượt quá giới hạn 10 MB.";
        }

        const extension = file.name
            .split(".")
            .pop()
            .toLowerCase();

        if (!ALLOWED_EXTENSIONS.has(extension)) {
            return "Chỉ chấp nhận file JPEG hoặc PNG.";
        }

        if (
            file.type &&
            !ALLOWED_TYPES.has(file.type.toLowerCase())
        ) {
            return "Định dạng MIME không được hỗ trợ.";
        }

        return null;
    }

    function handleFileSelection() {

        const file = elements.fileInput.files?.[0];

        if (!file) {
            return;
        }

        const error = validateFile(file);

        if (error) {

            resetSelection();

            setStatus(error, "error");

            return;
        }

        selectedFile = file;

        releasePreview();
        clearResult();
        hideStatus();

        previewUrl = URL.createObjectURL(file);

        elements.previewImage.src = previewUrl;

        elements.fileName.textContent = file.name;
        elements.fileSize.textContent = formatBytes(file.size);

        elements.imageDimensions.textContent =
            "Đang kiểm tra kích thước ảnh...";

        elements.previewSection.hidden = false;

        elements.previewImage.onload = () => {

            elements.imageDimensions.textContent =
                `${elements.previewImage.naturalWidth} × ` +
                `${elements.previewImage.naturalHeight} px`;
        };

        elements.previewImage.onerror = () => {

            setStatus(
                "Không thể hiển thị ảnh. Vui lòng chọn file ảnh hợp lệ.",
                "error"
            );

            resetSelection();
        };

        setStatus(
            "Ảnh đã được chọn. Hãy kiểm tra ảnh trước khi phân tích.",
            "success"
        );

        updateButtons();
    }

    async function loadModelInfo() {

        elements.modelStatus.textContent = "Đang tải...";

        try {

            const response = await fetch(
                `${API}/model-info`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    credentials: "omit",
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Model information unavailable (${response.status}).`
                );
            }

            const data = await response.json();

            modelInfo = data;

            elements.modelName.textContent =
                data.display_name || "—";

            elements.modelArchitecture.textContent =
                data.architecture || "—";

            elements.modelVersion.textContent =
                data.version || "—";

            elements.modelClasses.replaceChildren();

            (data.class_names || []).forEach((className) => {

                const chip = document.createElement("span");

                chip.className = "class-chip";
                chip.textContent = formatClassLabel(className);

                elements.modelClasses.appendChild(chip);
            });

            elements.modelStatus.textContent = "Available";

        } catch (error) {

            modelInfo = null;

            elements.modelStatus.textContent = "Unavailable";

            setStatus(
                "Không thể tải thông tin model. Vui lòng tải lại trang hoặc thử lại sau.",
                "warning"
            );

            console.error(
                "Guest model-info error:",
                error
            );
        }
    }

    function extractErrorMessage(payload) {

        const detail = payload?.detail;

        if (typeof detail === "string") {
            return detail;
        }

        if (Array.isArray(detail)) {

            return detail
                .map((item) => item.msg || JSON.stringify(item))
                .join("; ");
        }

        return payload?.message
            || "Đã xảy ra lỗi trong quá trình phân tích.";
    }

    function getHttpErrorMessage(statusCode, payload, retryAfter) {

        if (statusCode === 413) {
            return "Ảnh vượt quá giới hạn dung lượng cho phép.";
        }

        if (statusCode === 422) {
            return extractErrorMessage(payload)
                || "Ảnh không hợp lệ hoặc không phải ảnh X-quang ngực.";
        }

        if (statusCode === 429) {

            const seconds = Number(retryAfter);

            if (Number.isFinite(seconds) && seconds > 0) {
                return `Bạn đã đạt giới hạn phân tích. Vui lòng thử lại sau ${seconds} giây.`;
            }

            return "Bạn đã đạt giới hạn phân tích. Vui lòng thử lại sau.";
        }

        if (statusCode === 503) {
            return "Hệ thống AI hiện đang bận hoặc tạm thời không khả dụng.";
        }

        if (statusCode === 400) {
            return extractErrorMessage(payload);
        }

        return extractErrorMessage(payload);
    }

    function createProbabilityRow(className, value, predictedClass) {

        const numericValue = Number(value);

        if (
            !Number.isFinite(numericValue) ||
            numericValue < 0 ||
            numericValue > 1
        ) {
            throw new Error(
                `Invalid probability for ${className}.`
            );
        }

        const row = document.createElement("div");

        row.className = "probability-row";

        if (className === predictedClass) {
            row.classList.add("is-predicted");
        }

        const label = document.createElement("div");
        label.className = "probability-label";

        const name = document.createElement("span");
        name.textContent = formatClassLabel(className);

        const percentage = document.createElement("strong");
        percentage.textContent = formatPercent(numericValue);

        label.append(name, percentage);

        const track = document.createElement("div");
        track.className = "probability-track";

        const fill = document.createElement("div");
        fill.className = "probability-fill";

        fill.style.width =
            `${Math.min(100, numericValue * 100)}%`;

        track.appendChild(fill);

        row.append(label, track);

        return row;
    }

    function renderResult(data) {

        if (
            !data?.model ||
            !data?.image ||
            !data?.prediction
        ) {
            throw new Error("Invalid Guest API response.");
        }

        const prediction = data.prediction;
        const image = data.image;
        const resultModel = data.model;

        const probabilities = prediction.probabilities;

        if (
            typeof probabilities !== "object" ||
            probabilities === null ||
            Array.isArray(probabilities)
        ) {
            throw new Error("Invalid probability data.");
        }

        if (
            !Number.isFinite(Number(prediction.confidence)) ||
            prediction.confidence < 0 ||
            prediction.confidence > 1
        ) {
            throw new Error("Invalid model confidence.");
        }

        elements.predictedClass.textContent =
            formatClassLabel(prediction.predicted_class);

        elements.predictionConfidence.textContent =
            formatPercent(prediction.confidence);

        elements.probabilityList.replaceChildren();

        const orderedClasses =
            resultModel.class_names?.length
                ? resultModel.class_names
                : Object.keys(probabilities);

        orderedClasses.forEach((className) => {

            if (
                !Object.prototype.hasOwnProperty.call(
                    probabilities,
                    className
                )
            ) {
                return;
            }

            const row = createProbabilityRow(
                className,
                probabilities[className],
                prediction.predicted_class
            );

            elements.probabilityList.appendChild(row);
        });

        elements.resultFormat.textContent =
            image.image_format || "—";

        elements.resultDimensions.textContent =
            `${image.width} × ${image.height} px`;

        elements.resultModelVersion.textContent =
            resultModel.version || "—";

        elements.resultSection.hidden = false;

        elements.resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    async function analyzeImage() {

        if (!selectedFile || isAnalyzing) {
            return;
        }

        const error = validateFile(selectedFile);

        if (error) {
            setStatus(error, "error");
            return;
        }

        isAnalyzing = true;

        updateButtons();

        elements.analyzeButtonText.textContent =
            "Analyzing...";

        clearResult();

        setStatus(
            "Đang gửi ảnh và thực hiện phân tích bằng mô hình AI. Vui lòng chờ...",
            "info"
        );

        const formData = new FormData();

        formData.append(
            "file",
            selectedFile,
            selectedFile.name
        );

        try {

            const response = await fetch(
                `${API}/analyze`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json",
                    },
                    credentials: "omit",
                    cache: "no-store",
                }
            );

            let payload;

            try {
                payload = await response.json();
            } catch {
                payload = {};
            }

            if (!response.ok) {

                throw new Error(
                    getHttpErrorMessage(
                        response.status,
                        payload,
                        response.headers.get("Retry-After")
                    )
                );
            }

            renderResult(payload);

            setStatus(
                "Phân tích hoàn tất. Vui lòng đọc kỹ thông tin và lưu ý y tế.",
                "success"
            );

        } catch (error) {

            setStatus(
                error.message || "Không thể kết nối tới Guest API.",
                "error"
            );

            console.error(
                "Guest analysis error:",
                error
            );

        } finally {

            isAnalyzing = false;

            elements.analyzeButtonText.textContent =
                "Analyze Image";

            updateButtons();
        }
    }

    elements.fileInput.addEventListener(
        "change",
        handleFileSelection
    );

    elements.analyzeButton.addEventListener(
        "click",
        analyzeImage
    );

    elements.clearButton.addEventListener(
        "click",
        resetSelection
    );

    window.addEventListener(
        "pagehide",
        releasePreview
    );

    updateButtons();

    loadModelInfo();

})();
