/*
============================================================
POLYSORT AI — MAIN JAVASCRIPT
Intelligent Plastic Identification & Sorting
Backend Connected Version
============================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ============================================================
       CONFIGURATION
    ============================================================ */

    const BACKEND_URL =
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1")
        ? "http://127.0.0.1:8000"
        : window.location.origin;
    const API_URL = `${BACKEND_URL}/analyze`;
    const CONFIDENCE_THRESHOLD = 80;

    /* ============================================================
       APPLICATION STATE
    ============================================================ */

    const state = {
        totalAnalyzed: 0,
        totalConfidence: 0,
        autoSorted: 0,
        humanReview: 0,
        objectsProcessed: 0,
        objectsSorted: 0,
        objectsReview: 0,

        currentFile: null,
        currentResult: null,

        cameraStream: null,
        cameraActive: false,

        analysisHistory: []
    };

    /* ============================================================
       DOM ELEMENTS
    ============================================================ */

    const sidebar = document.getElementById("sidebar");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");

    const navItems = document.querySelectorAll(".nav-item");
    const pageSections = document.querySelectorAll(".page-section");

    const pageTitle = document.getElementById("pageTitle");
    const refreshBtn = document.getElementById("refreshBtn");

    const startAnalysisBtn =
        document.getElementById("startAnalysisBtn");

    const cameraBtn =
        document.getElementById("cameraBtn");

    /* Dashboard Upload */

    const dashboardUploadCard =
        document.getElementById("dashboardUploadCard");

    const dashboardFileInput =
        document.getElementById("dashboardFileInput");

    const dashboardUploadBtn =
        document.getElementById("dashboardUploadBtn");

    /* Analysis Upload */

    const analysisFileInput =
        document.getElementById("analysisFileInput");

    const analysisUploadBtn =
        document.getElementById("analysisUploadBtn");

    const largeUploadCard =
        document.getElementById("largeUploadCard");

    /* Loading */

    const loadingOverlay =
        document.getElementById("loadingOverlay");

    const loadingText =
        document.getElementById("loadingText");

    const loadingSteps =
        document.querySelectorAll(".loading-step");

    /* Existing Result Section */

    const resultContent =
        document.getElementById("resultContent");

    const resultImage =
        document.getElementById("resultImage");

    const resultMaterial =
        document.getElementById("resultMaterial");

    const confidenceBadge =
        document.getElementById("confidenceBadge");

    const confidenceValue =
        document.getElementById("confidenceValue");

    const confidenceFill =
        document.getElementById("confidenceFill");

    const decisionAction =
        document.getElementById("decisionAction");

    const decisionText =
        document.getElementById("decisionText");

    const polymerName =
        document.getElementById("polymerName");

    const resinCode =
        document.getElementById("resinCode");

    const plasticFamily =
        document.getElementById("plasticFamily");

    const recyclingRecommendation =
        document.getElementById("recyclingRecommendation");

    /* Dashboard Statistics */

    const totalAnalyzed =
        document.getElementById("totalAnalyzed");

    const averageConfidence =
        document.getElementById("averageConfidence");

    const autoSortable =
        document.getElementById("autoSortable");

    const humanReview =
        document.getElementById("humanReview");

    /* Activity */

    const activityList =
        document.getElementById("activityList");

    const viewAllBtn =
        document.getElementById("viewAllBtn");

    /* Sorting */

    const runSortingBtn =
        document.getElementById("runSortingBtn");

    const conveyor =
        document.getElementById("conveyor");

    const objectsProcessed =
        document.getElementById("objectsProcessed");

    const objectsSorted =
        document.getElementById("objectsSorted");

    const objectsReview =
        document.getElementById("objectsReview");

    /* Camera */

    const cameraModal =
        document.getElementById("cameraModal");

    const closeCameraBtn =
        document.getElementById("closeCameraBtn");

    const startCameraBtn =
        document.getElementById("startCameraBtn");

    /* Toast */

    const toast =
        document.getElementById("toast");

    const toastIcon =
        document.getElementById("toastIcon");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");

    /* AI Status */

    const aiStatus =
        document.getElementById("aiStatus");

    /* ============================================================
       FULL ANALYSIS RESULT PAGE
    ============================================================ */

    const analysisResultPage =
        document.getElementById("analysisResultPage");

    const finalResultImage =
        document.getElementById("finalResultImage");

    const finalMaterial =
        document.getElementById("finalMaterial");

    const finalPolymer =
        document.getElementById("finalPolymer");

    const finalConfidence =
        document.getElementById("finalConfidence");

    const finalConfidenceText =
        document.getElementById("finalConfidenceText");

    const finalConfidenceFill =
        document.getElementById("finalConfidenceFill");

    const finalDecision =
        document.getElementById("finalDecision");

    const finalDecisionText =
        document.getElementById("finalDecisionText");

    const finalPolymerName =
        document.getElementById("finalPolymerName");

    const finalResinCode =
        document.getElementById("finalResinCode");

    const finalPlasticFamily =
        document.getElementById("finalPlasticFamily");

    const finalRecycling =
        document.getElementById("finalRecycling");

    const backToDashboardBtn =
        document.getElementById("backToDashboardBtn");

    const analyzeAnotherBtn =
        document.getElementById("analyzeAnotherBtn");

    /* ============================================================
       SECTION TITLES
    ============================================================ */

    const sectionTitles = {
        dashboard: "Plastic Intelligence Dashboard",
        analyze: "Analyze Plastic Waste",
        sorting: "Smart Sorting Center",
        materials: "Plastic Materials",
        analytics: "Sorting Analytics",
        "how-it-works": "How PolySort AI Works",
        settings: "System Settings"
    };

    /* ============================================================
       MATERIAL DATABASE
    ============================================================ */

    const materialDatabase = {
        PET: {
            polymer: "Polyethylene Terephthalate",
            resin: "#1",
            family: "Thermoplastic",
            recycling:
                "Highly recyclable. Suitable for bottle-to-bottle and fiber recycling."
        },

        HDPE: {
            polymer: "High-Density Polyethylene",
            resin: "#2",
            family: "Thermoplastic",
            recycling:
                "Widely recyclable. Commonly processed into containers and plastic lumber."
        },

        PVC: {
            polymer: "Polyvinyl Chloride",
            resin: "#3",
            family: "Thermoplastic",
            recycling:
                "Specialized recycling recommended. Avoid mixing with general plastic streams."
        },

        LDPE: {
            polymer: "Low-Density Polyethylene",
            resin: "#4",
            family: "Thermoplastic",
            recycling:
                "Recyclable through suitable film and flexible-plastic collection programs."
        },

        PP: {
            polymer: "Polypropylene",
            resin: "#5",
            family: "Thermoplastic",
            recycling:
                "Increasingly recyclable. Suitable for containers, caps and automotive products."
        },

        PS: {
            polymer: "Polystyrene",
            resin: "#6",
            family: "Thermoplastic",
            recycling:
                "Recycling availability is limited. Specialized facilities may be required."
        },

        OTHER: {
            polymer: "Other / Mixed Plastic",
            resin: "#7",
            family: "Mixed / Unknown",
            recycling:
                "Manual verification recommended before selecting a recycling pathway."
        }
    };

    /* ============================================================
       INITIALIZATION
    ============================================================ */

    initializeApp();

    function initializeApp() {
        loadState();

        updateDashboardStats();
        updateSortingStats();

        setupNavigation();
        setupMobileMenu();
        setupUploadHandlers();
        setupButtons();
        setupResultPageButtons();
        setupCamera();
        setupSettings();

        checkBackend();
        updateActivityList();

        console.log("PolySort AI initialized successfully.");
    }

    /* ============================================================
       NAVIGATION
    ============================================================ */

    function setupNavigation() {
        navItems.forEach((item) => {
            item.addEventListener("click", () => {
                const targetSection = item.dataset.section;

                if (!targetSection) {
                    return;
                }

                hideAnalysisResultPage();
                navigateTo(targetSection);
            });
        });
    }

    function navigateTo(sectionId) {
        pageSections.forEach((section) => {
            section.classList.remove("active");
        });

        navItems.forEach((item) => {
            item.classList.remove("active");
        });

        const targetSection =
            document.getElementById(sectionId);

        const targetNav =
            document.querySelector(
                `.nav-item[data-section="${sectionId}"]`
            );

        if (targetSection) {
            targetSection.classList.add("active");
        }

        if (targetNav) {
            targetNav.classList.add("active");
        }

        if (pageTitle) {
            pageTitle.textContent =
                sectionTitles[sectionId] || "PolySort AI";
        }

        closeMobileMenu();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    /* ============================================================
       MOBILE MENU
    ============================================================ */

    function setupMobileMenu() {
        if (!mobileMenuBtn || !sidebar) {
            return;
        }

        mobileMenuBtn.addEventListener("click", (event) => {
            event.stopPropagation();

            sidebar.classList.toggle("open");
        });

        document.addEventListener("click", (event) => {
            if (
                window.innerWidth <= 900 &&
                sidebar.classList.contains("open") &&
                !sidebar.contains(event.target) &&
                !mobileMenuBtn.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });
    }

    function closeMobileMenu() {
        if (sidebar) {
            sidebar.classList.remove("open");
        }
    }

    /* ============================================================
       UPLOAD HANDLERS
    ============================================================ */

    function setupUploadHandlers() {

        /* Dashboard Upload Button */

        if (
            dashboardUploadBtn &&
            dashboardFileInput
        ) {
            dashboardUploadBtn.addEventListener(
                "click",
                (event) => {
                    event.stopPropagation();

                    dashboardFileInput.click();
                }
            );

            dashboardFileInput.addEventListener(
                "change",
                (event) => {
                    const file =
                        event.target.files[0];

                    if (file) {
                        handleSelectedFile(file);
                    }

                    event.target.value = "";
                }
            );
        }

        /* Dashboard Upload Card */

        if (
            dashboardUploadCard &&
            dashboardFileInput
        ) {
            dashboardUploadCard.addEventListener(
                "click",
                (event) => {
                    if (
                        event.target.tagName !== "BUTTON" &&
                        !event.target.closest("button")
                    ) {
                        dashboardFileInput.click();
                    }
                }
            );
        }

        /* Analysis Upload Button */

        if (
            analysisUploadBtn &&
            analysisFileInput
        ) {
            analysisUploadBtn.addEventListener(
                "click",
                (event) => {
                    event.stopPropagation();

                    analysisFileInput.click();
                }
            );

            analysisFileInput.addEventListener(
                "change",
                (event) => {
                    const file =
                        event.target.files[0];

                    if (file) {
                        handleSelectedFile(file);
                    }

                    event.target.value = "";
                }
            );
        }

        setupDragAndDrop(dashboardUploadCard);
        setupDragAndDrop(largeUploadCard);
    }

    /* ============================================================
       DRAG & DROP
    ============================================================ */

    function setupDragAndDrop(element) {
        if (!element) {
            return;
        }

        ["dragenter", "dragover"].forEach(
            (eventName) => {
                element.addEventListener(
                    eventName,
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        element.classList.add(
                            "drag-over"
                        );
                    }
                );
            }
        );

        ["dragleave", "drop"].forEach(
            (eventName) => {
                element.addEventListener(
                    eventName,
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        element.classList.remove(
                            "drag-over"
                        );
                    }
                );
            }
        );

        element.addEventListener(
            "drop",
            (event) => {
                const files =
                    event.dataTransfer.files;

                if (
                    files &&
                    files.length > 0
                ) {
                    handleSelectedFile(files[0]);
                }
            }
        );
    }

    /* ============================================================
       FILE VALIDATION
    ============================================================ */

    function validateFile(file) {
        if (!file) {
            return false;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            showToast(
                "Invalid File",
                "Please upload a JPG, JPEG, PNG or WEBP image.",
                "error"
            );

            return false;
        }

        const maxSize =
            10 * 1024 * 1024;

        if (file.size > maxSize) {
            showToast(
                "File Too Large",
                "Maximum allowed image size is 10MB.",
                "error"
            );

            return false;
        }

        return true;
    }

    /* ============================================================
       FILE SELECTION
    ============================================================ */

    function handleSelectedFile(file) {
        if (!validateFile(file)) {
            return;
        }

        state.currentFile = file;

        hideAnalysisResultPage();

        navigateTo("analyze");

        showImagePreview(file);

        showToast(
            "Image Ready",
            `${file.name} is ready for AI analysis.`,
            "success"
        );

        setTimeout(() => {
            analyzeImage(file);
        }, 300);
    }

    /* ============================================================
       IMAGE PREVIEW
    ============================================================ */

    function showImagePreview(file) {
        if (!resultImage) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            resultImage.src =
                event.target.result;

            resultImage.style.display =
                "block";
        };

        reader.onerror = () => {
            showToast(
                "Preview Error",
                "Unable to preview the selected image.",
                "error"
            );
        };

        reader.readAsDataURL(file);
    }

    /* ============================================================
       MAIN BACKEND ANALYSIS
    ============================================================ */

    async function analyzeImage(file) {
        if (!file) {
            return;
        }

        hideAnalysisResultPage();

        navigateTo("analyze");

        showLoading();

        try {
            console.log(
                "Connecting to PolySort backend:",
                API_URL
            );

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",
                        body: formData
                    }
                );

            console.log(
                "Backend response status:",
                response.status
            );

            let result = null;

            try {
                result =
                    await response.json();
            } catch (jsonError) {
                throw new Error(
                    "Backend returned an invalid JSON response."
                );
            }

            console.log(
                "FULL BACKEND RESPONSE:",
                result
            );

            if (!response.ok) {
                const backendMessage =
                    result?.detail ||
                    result?.message ||
                    result?.error ||
                    `Backend returned HTTP ${response.status}`;

                throw new Error(
                    backendMessage
                );
            }

            const hasDetection =
                result?.detection ||
                result?.analysis ||
                result?.material ||
                result?.prediction ||
                result?.class_name ||
                result?.label ||
                result?.plastic_type;

            if (
                result?.success !== true &&
                !hasDetection
            ) {
                const backendError =
                    result?.message ||
                    result?.error ||
                    "Backend could not analyze this image.";

                throw new Error(
                    backendError
                );
            }

            await finishLoading();

            processAnalysisResult(
                result,
                file
            );

            setBackendOnline();

        } catch (error) {

            console.error(
                "PolySort backend analysis error:",
                error
            );

            hideLoading();

            setBackendOffline();

            showToast(
                "Backend Connection Error",
                getBackendErrorMessage(error),
                "error"
            );
        }
    }

    /* ============================================================
       BACKEND ERROR MESSAGE
    ============================================================ */

    function getBackendErrorMessage(error) {
        const message =
            String(
                error?.message ||
                error
            );

        const lowerMessage =
            message.toLowerCase();

        if (
            lowerMessage.includes(
                "failed to fetch"
            ) ||
            lowerMessage.includes(
                "networkerror"
            ) ||
            lowerMessage.includes(
                "err_connection_refused"
            )
        ) {
            return (
                "Cannot connect to FastAPI. " +
                "Make sure the backend is running on 127.0.0.1:8000."
            );
        }

        if (
            lowerMessage.includes(
                "cors"
            ) ||
            lowerMessage.includes(
                "access-control"
            )
        ) {
            return (
                "CORS blocked the request. " +
                "Check FastAPI CORS configuration."
            );
        }

        return message;
    }

    /* ============================================================
       PROCESS BACKEND RESULT
    ============================================================ */

    function processAnalysisResult(
        result,
        file
    ) {
        console.log(
            "Processing actual AI result:",
            result
        );

        const normalized =
            normalizeResult(result);

        const material =
            normalized.material;

        const confidence =
            normalized.confidence;

        if (!material) {
            throw new Error(
                "Backend did not return a valid plastic material."
            );
        }

        const decision =
            getDecision(confidence);

        const materialInfo =
            materialDatabase[material] ||
            materialDatabase.OTHER;

        state.currentResult = {
            material,
            confidence,
            decision,
            timestamp:
                new Date().toISOString(),
            fileName: file.name
        };

        /* Update old inline result */

        updateResultUI(
            material,
            confidence,
            decision,
            materialInfo
        );

        /* Update statistics */

        updateStatistics(
            confidence,
            decision
        );

        /* Activity */

        addActivity(
            state.currentResult
        );

        /* Save */

        saveState();

        /*
        IMPORTANT:
        Do NOT navigate back to analyze here.
        Instead open the full result page.
        */

        showAnalysisResultPage(
            material,
            confidence,
            decision,
            materialInfo,
            file
        );

        showToast(
            "AI Analysis Complete",
            `${material} detected with ${confidence}% confidence.`,
            confidence >= CONFIDENCE_THRESHOLD
                ? "success"
                : "warning"
        );

        console.log(
            "FINAL AI RESULT:",
            {
                material,
                confidence,
                decision
            }
        );
    }

    /* ============================================================
       NORMALIZE BACKEND RESPONSE
    ============================================================ */

    function normalizeResult(result) {
        const detection =
            result?.detection || {};

        const analysis =
            result?.analysis || {};

        let material =
            detection.material ??
            detection.class_name ??
            detection.label ??
            analysis.material ??
            analysis.class_name ??
            analysis.label ??
            result?.material ??
            result?.prediction ??
            result?.class_name ??
            result?.label ??
            result?.plastic_type ??
            "OTHER";

        material =
            String(material)
                .trim()
                .toUpperCase();

        const aliases = {
            "POLYETHYLENE TEREPHTHALATE":
                "PET",

            "HIGH-DENSITY POLYETHYLENE":
                "HDPE",

            "HIGH DENSITY POLYETHYLENE":
                "HDPE",

            "POLYVINYL CHLORIDE":
                "PVC",

            "LOW-DENSITY POLYETHYLENE":
                "LDPE",

            "LOW DENSITY POLYETHYLENE":
                "LDPE",

            "POLYPROPYLENE":
                "PP",

            "POLYSTYRENE":
                "PS",

            "OTHER / MIXED PLASTIC":
                "OTHER",

            "MIXED PLASTIC":
                "OTHER",

            "UNKNOWN":
                "OTHER"
        };

        if (aliases[material]) {
            material =
                aliases[material];
        }

        /*
        Handle variations such as:

        PET Plastic
        PET
        HDPE Plastic
        PVC Plastic
        */

        if (!materialDatabase[material]) {

            if (
                material.includes("PET")
            ) {
                material = "PET";

            } else if (
                material.includes("HDPE")
            ) {
                material = "HDPE";

            } else if (
                material.includes("PVC")
            ) {
                material = "PVC";

            } else if (
                material.includes("LDPE")
            ) {
                material = "LDPE";

            } else if (
                material.includes("PP")
            ) {
                material = "PP";

            } else if (
                material.includes("PS")
            ) {
                material = "PS";

            } else {
                material = "OTHER";
            }
        }

        let confidence =
            detection.confidence ??
            detection.score ??
            detection.probability ??
            analysis.confidence ??
            analysis.score ??
            analysis.probability ??
            result?.confidence ??
            result?.score ??
            result?.probability ??
            0;

        confidence =
            Number(confidence);

        if (
            !Number.isFinite(
                confidence
            )
        ) {
            confidence = 0;
        }

        /*
        Backend may return:

        0.95 -> 95%
        95   -> 95%
        */

        if (
            confidence > 0 &&
            confidence <= 1
        ) {
            confidence *= 100;
        }

        confidence =
            Math.max(
                0,
                Math.min(
                    100,
                    Math.round(
                        confidence
                    )
                )
            );

        console.log(
            "Normalized backend result:",
            {
                material,
                confidence
            }
        );

        return {
            material,
            confidence
        };
    }

    /* ============================================================
       DECISION ENGINE
    ============================================================ */

    function getDecision(confidence) {

        if (
            confidence >=
            CONFIDENCE_THRESHOLD
        ) {
            return "AUTO SORT";
        }

        if (confidence >= 50) {
            return "HUMAN REVIEW";
        }

        return "MANUAL CHECK";
    }

    /* ============================================================
       UPDATE INLINE RESULT UI
    ============================================================ */

    function updateResultUI(
        material,
        confidence,
        decision,
        info
    ) {
        if (resultContent) {
            resultContent.hidden = false;

            resultContent.style.display =
                "block";

            resultContent.classList.add(
                "result-visible"
            );
        }

        if (resultMaterial) {
            resultMaterial.textContent =
                material;

            resultMaterial.style.display =
                "block";
        }

        if (confidenceBadge) {
            confidenceBadge.textContent =
                `${confidence}%`;

            confidenceBadge.style.display =
                "inline-flex";
        }

        if (confidenceValue) {
            confidenceValue.textContent =
                `${confidence}%`;
        }

        if (confidenceFill) {
            confidenceFill.style.width =
                `${confidence}%`;

            confidenceFill.style.display =
                "block";
        }

        if (decisionAction) {
            decisionAction.textContent =
                decision;
        }

        if (decisionText) {

            if (
                decision ===
                "AUTO SORT"
            ) {
                decisionText.textContent =
                    "High confidence prediction. Sample can enter the automated sorting stream.";

            } else if (
                decision ===
                "HUMAN REVIEW"
            ) {
                decisionText.textContent =
                    "Medium confidence prediction. Human verification is recommended.";

            } else {
                decisionText.textContent =
                    "Low confidence prediction. Manual inspection is required.";
            }
        }

        if (polymerName) {
            polymerName.textContent =
                info.polymer;
        }

        if (resinCode) {
            resinCode.textContent =
                info.resin;
        }

        if (plasticFamily) {
            plasticFamily.textContent =
                info.family;
        }

        if (recyclingRecommendation) {
            recyclingRecommendation.textContent =
                info.recycling;
        }

        if (
            decision ===
            "AUTO SORT"
        ) {
            updateDecisionVisual(
                "success"
            );

        } else if (
            decision ===
            "HUMAN REVIEW"
        ) {
            updateDecisionVisual(
                "warning"
            );

        } else {
            updateDecisionVisual(
                "danger"
            );
        }
    }

    /* ============================================================
       FULL ANALYSIS RESULT PAGE
    ============================================================ */

function showAnalysisResultPage(
    material,
    confidence,
    decision,
    info,
    file
) {
    console.log("Opening final analysis result page...");

    const app = document.querySelector(".app");

    // Hide main dashboard
    if (app) {
        app.style.setProperty("display", "none", "important");
    }

    // Make result page visible
    if (!analysisResultPage) {
        console.error("analysisResultPage not found!");
        return;
    }

    analysisResultPage.removeAttribute("hidden");

    analysisResultPage.style.setProperty(
        "display",
        "block",
        "important"
    );

    // Show uploaded image
    if (finalResultImage && file) {
        try {
            const imageURL = URL.createObjectURL(file);

            finalResultImage.src = imageURL;
            finalResultImage.style.display = "block";

            finalResultImage.onload = () => {
                URL.revokeObjectURL(imageURL);
            };
        } catch (error) {
            console.error(
                "Unable to display result image:",
                error
            );
        }
    }

    // Material
    if (finalMaterial) {
        finalMaterial.textContent = material;
    }

    // Polymer
    if (finalPolymer) {
        finalPolymer.textContent = info.polymer;
    }

    // Confidence
    if (finalConfidence) {
        finalConfidence.textContent = `${confidence}%`;
    }

    if (finalConfidenceText) {
        finalConfidenceText.textContent =
            `${confidence}% Confidence`;
    }

    if (finalConfidenceFill) {
        finalConfidenceFill.style.width =
            `${confidence}%`;
    }

    // Decision
    if (finalDecision) {
        finalDecision.textContent = decision;

        finalDecision.classList.remove(
            "success",
            "warning",
            "danger"
        );

        if (decision === "AUTO SORT") {
            finalDecision.classList.add("success");
        } else if (decision === "HUMAN REVIEW") {
            finalDecision.classList.add("warning");
        } else {
            finalDecision.classList.add("danger");
        }
    }

    if (finalDecisionText) {
        if (decision === "AUTO SORT") {
            finalDecisionText.textContent =
                "High confidence prediction. Sample can enter the automated sorting stream.";
        } else if (decision === "HUMAN REVIEW") {
            finalDecisionText.textContent =
                "Medium confidence prediction. Human verification is recommended.";
        } else {
            finalDecisionText.textContent =
                "Low confidence prediction. Manual inspection is required.";
        }
    }

    // Material details
    if (finalPolymerName) {
        finalPolymerName.textContent = info.polymer;
    }

    if (finalResinCode) {
        finalResinCode.textContent = info.resin;
    }

    if (finalPlasticFamily) {
        finalPlasticFamily.textContent = info.family;
    }

    if (finalRecycling) {
        finalRecycling.textContent = info.recycling;
    }

    // Confidence color
    if (finalConfidenceFill) {
        finalConfidenceFill.classList.remove(
            "success",
            "warning",
            "danger"
        );

        if (confidence >= CONFIDENCE_THRESHOLD) {
            finalConfidenceFill.classList.add("success");
        } else if (confidence >= 50) {
            finalConfidenceFill.classList.add("warning");
        } else {
            finalConfidenceFill.classList.add("danger");
        }
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    console.log(
        "Full analysis result page opened successfully."
    );
}

    /* ============================================================
       RESULT PAGE BUTTONS
    ============================================================ */

    function setupResultPageButtons() {

        /*
        Back to Dashboard
        */

        if (backToDashboardBtn) {
            backToDashboardBtn.addEventListener(
                "click",
                () => {

                    hideAnalysisResultPage();

                    navigateTo(
                        "dashboard"
                    );

                    showToast(
                        "Dashboard",
                        "Returned to the PolySort AI dashboard.",
                        "info"
                    );
                }
            );
        }

        /*
        Analyze Another Image
        */

        if (analyzeAnotherBtn) {
            analyzeAnotherBtn.addEventListener(
                "click",
                () => {

                    hideAnalysisResultPage();

                    navigateTo(
                        "analyze"
                    );

                    setTimeout(() => {

                        if (
                            analysisFileInput
                        ) {
                            analysisFileInput.click();
                        }

                    }, 250);
                }
            );
        }
    }

    /* ============================================================
       HIDE RESULT PAGE
    ============================================================ */

    function hideAnalysisResultPage() {

        if (analysisResultPage) {

            analysisResultPage.hidden =
                true;

            analysisResultPage.style.display =
                "none";
        }

        const app =
            document.querySelector(
                ".app"
            );

        if (app) {
            app.style.display =
                "";
        }
    }

    /* ============================================================
       DECISION VISUAL
    ============================================================ */

    function updateDecisionVisual(
        type
    ) {
        const decisionCard =
            document.querySelector(
                ".decision-card"
            );

        if (!decisionCard) {
            return;
        }

        decisionCard.classList.remove(
            "success",
            "warning",
            "danger"
        );

        decisionCard.classList.add(
            type
        );
    }

    /* ============================================================
       STATISTICS
    ============================================================ */

    function updateStatistics(
        confidence,
        decision
    ) {
        state.totalAnalyzed++;

        state.totalConfidence +=
            confidence;

        if (
            decision ===
            "AUTO SORT"
        ) {
            state.autoSorted++;

            state.objectsSorted++;

        } else {
            state.humanReview++;

            state.objectsReview++;
        }

        state.objectsProcessed++;

        updateDashboardStats();
        updateSortingStats();
    }

    function updateDashboardStats() {

        if (totalAnalyzed) {
            totalAnalyzed.textContent =
                state.totalAnalyzed;
        }

        if (averageConfidence) {

            const average =
                state.totalAnalyzed > 0
                    ? Math.round(
                        state.totalConfidence /
                        state.totalAnalyzed
                    )
                    : 0;

            averageConfidence.textContent =
                `${average}%`;
        }

        if (autoSortable) {

            const sortable =
                state.totalAnalyzed > 0
                    ? Math.round(
                        (
                            state.autoSorted /
                            state.totalAnalyzed
                        ) * 100
                    )
                    : 0;

            autoSortable.textContent =
                `${sortable}%`;
        }

        if (humanReview) {
            humanReview.textContent =
                state.humanReview;
        }
    }

    function updateSortingStats() {

        if (objectsProcessed) {
            objectsProcessed.textContent =
                state.objectsProcessed;
        }

        if (objectsSorted) {
            objectsSorted.textContent =
                state.objectsSorted;
        }

        if (objectsReview) {
            objectsReview.textContent =
                state.objectsReview;
        }
    }

    /* ============================================================
       ACTIVITY HISTORY
    ============================================================ */

    function addActivity(result) {

        state.analysisHistory.unshift(
            result
        );

        if (
            state.analysisHistory.length >
            20
        ) {
            state.analysisHistory =
                state.analysisHistory.slice(
                    0,
                    20
                );
        }

        updateActivityList();
    }

    function updateActivityList() {

        if (!activityList) {
            return;
        }

        if (
            state.analysisHistory.length ===
            0
        ) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">◌</div>

                    <h4>No analysis yet</h4>

                    <p>
                        Upload a plastic image to start
                        your first AI analysis.
                    </p>
                </div>
            `;

            return;
        }

        activityList.innerHTML =
            state.analysisHistory
                .map((item) => {

                    const time =
                        formatTime(
                            item.timestamp
                        );

                    const statusClass =
                        item.decision ===
                        "AUTO SORT"
                            ? "success"
                            : "warning";

                    return `
                        <div class="activity-item ${statusClass}">

                            <div class="activity-material-icon">
                                ♻
                            </div>

                            <div class="activity-info">

                                <strong>
                                    ${escapeHTML(
                                        item.material
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        item.fileName ||
                                        "Plastic image"
                                    )}
                                </span>

                            </div>

                            <div class="activity-confidence">

                                <strong>
                                    ${item.confidence}%
                                </strong>

                                <span>
                                    ${time}
                                </span>

                            </div>

                            <div class="activity-status">
                                ${escapeHTML(
                                    item.decision
                                )}
                            </div>

                        </div>
                    `;
                })
                .join("");
    }

    function formatTime(
        timestamp
    ) {
        const date =
            new Date(
                timestamp
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "Just now";
        }

        return date.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }

    /* ============================================================
       VIEW ALL
    ============================================================ */

    if (viewAllBtn) {

        viewAllBtn.addEventListener(
            "click",
            () => {

                hideAnalysisResultPage();

                navigateTo(
                    "analytics"
                );

                showToast(
                    "Analytics",
                    "Detailed sorting analytics are available here.",
                    "info"
                );
            }
        );
    }

    /* ============================================================
       MAIN BUTTONS
    ============================================================ */

    function setupButtons() {

        /* Start Analysis */

        if (startAnalysisBtn) {

            startAnalysisBtn.addEventListener(
                "click",
                () => {

                    hideAnalysisResultPage();

                    navigateTo(
                        "analyze"
                    );

                    setTimeout(() => {

                        if (
                            analysisFileInput
                        ) {
                            analysisFileInput.click();
                        }

                    }, 250);
                }
            );
        }

        /* Camera */

        if (cameraBtn) {

            cameraBtn.addEventListener(
                "click",
                openCameraModal
            );
        }

        /* Refresh */

        if (refreshBtn) {

            refreshBtn.addEventListener(
                "click",
                () => {

                    refreshBtn.classList.add(
                        "rotating"
                    );

                    setTimeout(() => {

                        refreshBtn.classList.remove(
                            "rotating"
                        );

                    }, 700);

                    checkBackend();

                    updateDashboardStats();
                    updateSortingStats();

                    showToast(
                        "Dashboard Refreshed",
                        "PolySort AI statistics have been updated.",
                        "success"
                    );
                }
            );
        }

        /* Sorting Simulation */

        if (runSortingBtn) {

            runSortingBtn.addEventListener(
                "click",
                runSortingSimulation
            );
        }
    }

    /* ============================================================
       SORTING SIMULATION
    ============================================================ */

    function runSortingSimulation() {

        if (
            !conveyor ||
            !runSortingBtn
        ) {
            return;
        }

        runSortingBtn.disabled =
            true;

        runSortingBtn.textContent =
            "⏳ Processing...";

        const items =
            conveyor.querySelectorAll(
                ".conveyor-item"
            );

        items.forEach(
            (item, index) => {

                item.classList.remove(
                    "sorting-active"
                );

                setTimeout(() => {

                    item.classList.add(
                        "sorting-active"
                    );

                }, index * 450);

                setTimeout(() => {

                    item.classList.remove(
                        "sorting-active"
                    );

                }, index * 450 + 1200);
            }
        );

        const simulationCount =
            items.length;

        state.objectsProcessed +=
            simulationCount;

        state.objectsSorted +=
            Math.max(
                0,
                simulationCount - 1
            );

        if (
            simulationCount > 0
        ) {
            state.objectsReview +=
                1;
        }

        updateSortingStats();
        updateDashboardStats();

        setTimeout(() => {

            runSortingBtn.disabled =
                false;

            runSortingBtn.textContent =
                "▶ Run Simulation";

            showToast(
                "Sorting Complete",
                `${simulationCount} plastic objects processed by the sorting pipeline.`,
                "success"
            );

            saveState();

        }, 2600);
    }

    /* ============================================================
       LOADING
    ============================================================ */

    function showLoading() {

        if (!loadingOverlay) {
            return;
        }

        loadingOverlay.hidden =
            false;

        loadingOverlay.style.display =
            "flex";

        let currentStep = 0;

        loadingSteps.forEach(
            (step) => {
                step.classList.remove(
                    "active"
                );
            }
        );

        if (loadingSteps[0]) {
            loadingSteps[0].classList.add(
                "active"
            );
        }

        const messages = [
            "Uploading image to AI backend...",
            "Detecting plastic material...",
            "Evaluating AI confidence...",
            "Generating sorting decision..."
        ];

        if (loadingText) {
            loadingText.textContent =
                messages[0];
        }

        clearInterval(
            window.polySortLoadingInterval
        );

        window.polySortLoadingInterval =
            setInterval(() => {

                currentStep++;

                if (
                    currentStep >=
                    loadingSteps.length
                ) {
                    currentStep =
                        loadingSteps.length - 1;
                }

                loadingSteps.forEach(
                    (step, index) => {

                        step.classList.toggle(
                            "active",
                            index <=
                            currentStep
                        );
                    }
                );

                if (loadingText) {

                    loadingText.textContent =
                        messages[currentStep] ||
                        messages[
                            messages.length - 1
                        ];
                }

            }, 700);
    }

    function finishLoading() {

        return new Promise(
            (resolve) => {

                setTimeout(() => {

                    hideLoading();

                    resolve();

                }, 500);
            }
        );
    }

    function hideLoading() {

        clearInterval(
            window.polySortLoadingInterval
        );

        if (loadingOverlay) {

            loadingOverlay.hidden =
                true;

            loadingOverlay.style.display =
                "none";
        }
    }

    /* ============================================================
       CAMERA
    ============================================================ */

    function setupCamera() {

        if (closeCameraBtn) {

            closeCameraBtn.addEventListener(
                "click",
                closeCameraModal
            );
        }

        if (startCameraBtn) {

            startCameraBtn.addEventListener(
                "click",
                handleCameraButton
            );
        }

        if (cameraModal) {

            cameraModal.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target ===
                        cameraModal
                    ) {
                        closeCameraModal();
                    }
                }
            );
        }

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    cameraModal &&
                    !cameraModal.hidden
                ) {
                    closeCameraModal();
                }
            }
        );
    }

    function handleCameraButton() {

        if (
            state.cameraActive
        ) {
            stopCamera();
        } else {
            startCamera();
        }
    }

    function openCameraModal() {

        if (!cameraModal) {
            return;
        }

        cameraModal.hidden =
            false;
    }

    function closeCameraModal() {

        stopCamera();

        if (cameraModal) {
            cameraModal.hidden =
                true;
        }
    }

    async function startCamera() {

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            showToast(
                "Camera Not Supported",
                "Your browser does not support camera access.",
                "error"
            );

            return;
        }

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia(
                    {
                        video: {
                            facingMode:
                                "environment"
                        },
                        audio: false
                    }
                );

            state.cameraStream =
                stream;

            state.cameraActive =
                true;

            const cameraPreview =
                document.querySelector(
                    ".camera-preview"
                );

            if (cameraPreview) {

                cameraPreview.innerHTML = `
                    <video
                        id="cameraVideo"
                        autoplay
                        playsinline
                    ></video>

                    <div class="camera-live-label">
                        ● LIVE
                    </div>
                `;

                const video =
                    document.getElementById(
                        "cameraVideo"
                    );

                if (video) {
                    video.srcObject =
                        stream;
                }
            }

            if (startCameraBtn) {

                startCameraBtn.textContent =
                    "Stop Camera";
            }

            showToast(
                "Camera Started",
                "Live camera is ready for plastic detection.",
                "success"
            );

        } catch (error) {

            console.error(
                "Camera error:",
                error
            );

            showToast(
                "Camera Access Denied",
                "Please allow camera permission in your browser.",
                "error"
            );
        }
    }

    function stopCamera() {

        if (
            state.cameraStream
        ) {

            state.cameraStream
                .getTracks()
                .forEach(
                    (track) => {
                        track.stop();
                    }
                );
        }

        state.cameraStream =
            null;

        state.cameraActive =
            false;

        const cameraPreview =
            document.querySelector(
                ".camera-preview"
            );

        if (cameraPreview) {

            cameraPreview.innerHTML = `
                <div class="camera-placeholder">

                    <span>◉</span>

                    <strong>
                        Camera Ready
                    </strong>

                    <small>
                        Live detection module
                    </small>

                </div>
            `;
        }

        if (startCameraBtn) {

            startCameraBtn.textContent =
                "Start Camera";
        }
    }

    /* ============================================================
       SETTINGS
    ============================================================ */

    function setupSettings() {

        const toggles =
            document.querySelectorAll(
                ".toggle"
            );

        toggles.forEach(
            (toggle) => {

                toggle.addEventListener(
                    "click",
                    () => {

                        toggle.classList.toggle(
                            "active"
                        );

                        const enabled =
                            toggle.classList.contains(
                                "active"
                            );

                        showToast(
                            "Setting Updated",

                            enabled
                                ? "System protection setting enabled."
                                : "System protection setting disabled.",

                            "success"
                        );
                    }
                );
            }
        );
    }

    /* ============================================================
       BACKEND STATUS
    ============================================================ */

    async function checkBackend() {

        if (!aiStatus) {
            return;
        }

        try {

            const response =
                await fetch(
                    `${BACKEND_URL}/health`,
                    {
                        method: "GET",
                        cache: "no-cache"
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `Backend returned ${response.status}`
                );
            }

            const result =
                await response.json();

            if (
                result &&
                (
                    result.status ===
                    "healthy" ||
                    result.success === true
                )
            ) {

                setBackendOnline();

                console.log(
                    "PolySort backend online."
                );

                return;
            }

            throw new Error(
                "Invalid backend health response."
            );

        } catch (error) {

            console.warn(
                "PolySort backend unavailable:",
                error
            );

            setBackendOffline();
        }
    }

    function setBackendOnline() {

        if (!aiStatus) {
            return;
        }

        aiStatus.textContent =
            "AI Online";

        aiStatus.classList.add(
            "online"
        );
    }

    function setBackendOffline() {

        if (!aiStatus) {
            return;
        }

        aiStatus.textContent =
            "Backend Offline";

        aiStatus.classList.remove(
            "online"
        );
    }

    /* ============================================================
       TOAST
    ============================================================ */

    function showToast(
        title,
        message,
        type = "success"
    ) {

        if (!toast) {
            return;
        }

        if (toastTitle) {
            toastTitle.textContent =
                title;
        }

        if (toastMessage) {
            toastMessage.textContent =
                message;
        }

        if (toastIcon) {

            if (
                type === "error"
            ) {
                toastIcon.textContent =
                    "×";

            } else if (
                type === "warning"
            ) {
                toastIcon.textContent =
                    "!";

            } else if (
                type === "info"
            ) {
                toastIcon.textContent =
                    "i";

            } else {
                toastIcon.textContent =
                    "✓";
            }
        }

        toast.classList.remove(
            "success",
            "error",
            "warning",
            "info",
            "show"
        );

        toast.classList.add(
            type
        );

        requestAnimationFrame(() => {

            toast.classList.add(
                "show"
            );
        });

        clearTimeout(
            window.polySortToastTimer
        );

        window.polySortToastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3500);
    }

    /* ============================================================
       LOCAL STORAGE
    ============================================================ */

    function saveState() {

        try {

            const savedData = {

                totalAnalyzed:
                    state.totalAnalyzed,

                totalConfidence:
                    state.totalConfidence,

                autoSorted:
                    state.autoSorted,

                humanReview:
                    state.humanReview,

                objectsProcessed:
                    state.objectsProcessed,

                objectsSorted:
                    state.objectsSorted,

                objectsReview:
                    state.objectsReview,

                analysisHistory:
                    state.analysisHistory
            };

            localStorage.setItem(
                "polysortAIState",
                JSON.stringify(
                    savedData
                )
            );

        } catch (error) {

            console.warn(
                "Unable to save PolySort state.",
                error
            );
        }
    }

    function loadState() {

        try {

            const saved =
                localStorage.getItem(
                    "polysortAIState"
                );

            if (!saved) {
                return;
            }

            const data =
                JSON.parse(saved);

            state.totalAnalyzed =
                Number(
                    data.totalAnalyzed || 0
                );

            state.totalConfidence =
                Number(
                    data.totalConfidence || 0
                );

            state.autoSorted =
                Number(
                    data.autoSorted || 0
                );

            state.humanReview =
                Number(
                    data.humanReview || 0
                );

            state.objectsProcessed =
                Number(
                    data.objectsProcessed || 0
                );

            state.objectsSorted =
                Number(
                    data.objectsSorted || 0
                );

            state.objectsReview =
                Number(
                    data.objectsReview || 0
                );

            state.analysisHistory =
                Array.isArray(
                    data.analysisHistory
                )
                    ? data.analysisHistory
                    : [];

        } catch (error) {

            console.warn(
                "Unable to load saved PolySort state.",
                error
            );
        }
    }

    /* ============================================================
       HTML ESCAPE
    ============================================================ */

    function escapeHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }

    /* ============================================================
       KEYBOARD SHORTCUTS
    ============================================================ */

    document.addEventListener(
        "keydown",
        (event) => {

            /* Ctrl + U = Analyze */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() ===
                "u"
            ) {

                event.preventDefault();

                hideAnalysisResultPage();

                navigateTo(
                    "analyze"
                );
            }

            /* Escape = Close mobile menu */

            if (
                event.key ===
                "Escape"
            ) {
                closeMobileMenu();
            }
        }
    );

    /* ============================================================
       WINDOW RESIZE
    ============================================================ */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >
                900
            ) {
                closeMobileMenu();
            }
        }
    );

    /* ============================================================
       BEFORE PAGE UNLOAD
    ============================================================ */

    window.addEventListener(
        "beforeunload",
        () => {

            stopCamera();

            saveState();
        }
    );

    /* ============================================================
       GLOBAL POLYSORT API
    ============================================================ */

    window.PolySortAI = {

        analyzeImage,

        navigateTo,

        showToast,

        checkBackend,

        getState: () => ({
            ...state
        }),

        resetStats: () => {

            state.totalAnalyzed =
                0;

            state.totalConfidence =
                0;

            state.autoSorted =
                0;

            state.humanReview =
                0;

            state.objectsProcessed =
                0;

            state.objectsSorted =
                0;

            state.objectsReview =
                0;

            state.analysisHistory =
                [];

            updateDashboardStats();

            updateSortingStats();

            updateActivityList();

            saveState();

            showToast(
                "Statistics Reset",
                "PolySort AI statistics have been reset.",
                "success"
            );
        }
    };

    /* ============================================================
       END OF POLYSORT AI
    ============================================================ */
});