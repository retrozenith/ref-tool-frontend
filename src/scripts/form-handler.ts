/**
 * Form handler for the ref-tool frontend
 * Handles autocomplete, form field updates, and submission
 */

import { filterTeams } from '../teams';

// API endpoint for report generation
const API_URL = 'https://ref-tool-worker.florianvictorcristea.workers.dev/api/generate-report';

// Category options per locality
export const CATEGORY_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
    'Ilfov': [
        { value: 'U9', label: 'U9 - Sub 9 ani' },
        { value: 'U11', label: 'U11 - Sub 11 ani' },
        { value: 'U13', label: 'U13 - Sub 13 ani' },
        { value: 'U15', label: 'U15+ - Sub 15 ani și peste' },
    ],
    'frf': [
        { value: 'U11', label: 'U11 - Interliga' },
        { value: 'U12', label: 'U12 - Interliga' },
        { value: 'U13', label: 'U13 - Liga Elitelor' },
        { value: 'U14', label: 'U14 - Liga Elitelor' },
        { value: 'U15', label: 'U15 - Liga Elitelor' },
        { value: 'U16', label: 'U16 - Liga Elitelor' },
        { value: 'U17', label: 'U17 - Liga Elitelor' },
        { value: 'U17F', label: 'U17 Feminin - Liga Elitelor' },
        { value: 'LIGA2', label: 'Liga 2' },
        { value: 'LIGA3', label: 'Liga 3' },
        { value: 'LIGAT', label: 'Liga de Tineret' },
        { value: 'CN', label: 'Campionate Naționale' },
    ]
};

// Categories that require second referee
const NEEDS_SECOND_REFEREE: Record<string, string[]> = {
    'Ilfov': ['U11', 'U13'],
    'frf': ['U11', 'U12', 'U13'],
};

// Categories that show the extended U15+ section
const EXTENDED_SECTION_CATEGORIES = [
    'U14', 'U15', 'U16', 'U17', 'U17F',
    'LIGA2', 'LIGA3', 'LIGAT', 'CN'
];

/**
 * Sets up autocomplete functionality for a team input field
 */
function setupAutocomplete(inputId: string, listId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    const list = document.getElementById(listId) as HTMLDivElement | null;
    if (!input || !list) return;

    let selectedIndex = -1;

    input.addEventListener('input', () => {
        const query = input.value;
        const matches = filterTeams(query);

        if (query.trim() === '' || matches.length === 0) {
            list.classList.remove('active');
            list.innerHTML = '';
            selectedIndex = -1;
            return;
        }

        const maxResults = 10;
        const displayMatches = matches.slice(0, maxResults);

        list.innerHTML = displayMatches
            .map((team, index) => `<div class="autocomplete-item" data-index="${index}">${team}</div>`)
            .join('');

        list.classList.add('active');
        selectedIndex = -1;
    });

    input.addEventListener('keydown', (e: KeyboardEvent) => {
        const items = list.querySelectorAll('.autocomplete-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection(items, selectedIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
            updateSelection(items, selectedIndex);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            (items[selectedIndex] as HTMLDivElement).click();
        } else if (e.key === 'Escape') {
            list.classList.remove('active');
            list.innerHTML = '';
            selectedIndex = -1;
        }
    });

    list.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('autocomplete-item')) {
            input.value = target.textContent || '';
            list.classList.remove('active');
            list.innerHTML = '';
            selectedIndex = -1;
        }
    });

    document.addEventListener('click', (e: Event) => {
        if (!input.contains(e.target as Node) && !list.contains(e.target as Node)) {
            list.classList.remove('active');
            list.innerHTML = '';
            selectedIndex = -1;
        }
    });

    function updateSelection(items: NodeListOf<Element>, index: number): void {
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }
}

/**
 * Updates form fields based on locality and category selection
 */
function updateFormFields(category: string | null): void {
    const u15Section = document.getElementById('u15Section');
    const fieldRefereeName2 = document.getElementById('field_referee_name_2');
    const reqRefereeName2 = document.getElementById('req_referee_name_2');
    const refereeName2Input = document.querySelector<HTMLInputElement>('input[name="referee_name_2"]');
    const localitySelect = document.getElementById('locality') as HTMLSelectElement | null;
    const selectedLocality = localitySelect?.value || '';

    // Locality fields for referees (only for FRF)
    const localityField1 = document.getElementById('field_locality_field_1');
    const localityField2 = document.getElementById('field_locality_field_2');
    const localityField3 = document.getElementById('field_locality_field_3');
    const localityField4 = document.getElementById('field_locality_field_4');
    const copyLocalityBtn = document.getElementById('copyLocalityBtn');

    if (!category) {
        if (u15Section) u15Section.style.display = 'none';
        if (fieldRefereeName2) fieldRefereeName2.style.display = 'none';
        if (refereeName2Input) {
            refereeName2Input.required = false;
            refereeName2Input.value = '';
        }
        return;
    }

    // Check if category needs second referee
    const needsSecondReferee = NEEDS_SECOND_REFEREE[selectedLocality]?.includes(category) || false;

    if (needsSecondReferee) {
        if (fieldRefereeName2) fieldRefereeName2.style.display = 'flex';
        if (refereeName2Input) refereeName2Input.required = true;
        if (reqRefereeName2) reqRefereeName2.style.display = 'inline';
        if (u15Section) u15Section.style.display = 'none';
    } else if (EXTENDED_SECTION_CATEGORIES.includes(category)) {
        // Categories that show U15+ section (extended info with assistant referees)
        if (fieldRefereeName2) fieldRefereeName2.style.display = 'none';
        if (refereeName2Input) {
            refereeName2Input.required = false;
            refereeName2Input.value = '';
        }
        if (u15Section) u15Section.style.display = 'block';

        // Show locality fields only for FRF
        const isFRF = selectedLocality === 'frf';
        if (localityField1) localityField1.style.display = isFRF ? 'flex' : 'none';
        if (localityField2) localityField2.style.display = isFRF ? 'flex' : 'none';
        if (localityField3) localityField3.style.display = isFRF ? 'flex' : 'none';
        if (localityField4) localityField4.style.display = isFRF ? 'flex' : 'none';
        if (copyLocalityBtn) copyLocalityBtn.style.display = isFRF ? 'flex' : 'none';
    } else {
        // Other categories (U9) - simple format
        if (fieldRefereeName2) fieldRefereeName2.style.display = 'none';
        if (refereeName2Input) {
            refereeName2Input.required = false;
            refereeName2Input.value = '';
        }
        if (u15Section) u15Section.style.display = 'none';
    }
}

/**
 * Shows an error message in the error display section
 */
function showError(text: string): void {
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');
    if (errorSection && errorMessage) {
        errorMessage.textContent = text;
        errorSection.style.display = 'block';
    }
}

/**
 * Hides the error display section
 */
function hideError(): void {
    const errorSection = document.getElementById('errorSection');
    if (errorSection) {
        errorSection.style.display = 'none';
    }
}

/**
 * Updates the submit button to show loading state
 */
function setButtonLoading(buttonText: HTMLElement | null, isLoading: boolean): void {
    if (!buttonText) return;

    if (isLoading) {
        buttonText.innerHTML = `
      <svg style="width: 20px; height: 20px; animation: spin 1s linear infinite;" fill="none" viewBox="0 0 24 24">
        <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Se generează raportul...
    `;
    } else {
        buttonText.innerHTML = `
      <svg style="width: 20px; height: 20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Generează raport PDF
    `;
    }
}

/**
 * Handles form submission
 */
async function handleFormSubmit(event: Event, form: HTMLFormElement, submitBtn: HTMLButtonElement): Promise<void> {
    event.preventDefault();
    hideError();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const buttonText = document.getElementById('buttonText');
    submitBtn.disabled = true;
    setButtonLoading(buttonText, true);

    const formData = new FormData(form);
    const payload: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
        const strValue = value.toString();
        if (strValue.trim() !== '') {
            payload[key] = strValue;
        }
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Eroare ${response.status}: ${errorText}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `raport_arbitraj_${payload.match_date || 'document'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Eroare la generare:', error);
        const errorMessage = error instanceof Error ? error.message : 'A apărut o eroare. Verificați conexiunea și încercați din nou.';
        showError(errorMessage);
    } finally {
        submitBtn.disabled = false;
        setButtonLoading(buttonText, false);
    }
}

/**
 * Handles locality change and updates category options
 */
function handleLocalityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedLocality = target.value;
    const ageCategorySelect = document.getElementById('ageCategory') as HTMLSelectElement | null;

    if (!ageCategorySelect) return;

    // Clear current options
    ageCategorySelect.innerHTML = '<option value="">Selectează categoria de vârstă</option>';

    if (selectedLocality && CATEGORY_OPTIONS[selectedLocality]) {
        // Enable and populate
        ageCategorySelect.disabled = false;
        CATEGORY_OPTIONS[selectedLocality].forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            ageCategorySelect.appendChild(option);
        });
    } else {
        // Disable if no locality selected
        ageCategorySelect.disabled = true;
        ageCategorySelect.innerHTML = '<option value="">Mai întâi selectează asociația</option>';
    }

    // Reset dependent fields when locality changes
    ageCategorySelect.value = '';
    updateFormFields(null);
}

/**
 * Initializes all form handlers
 */
export function initFormHandlers(): void {
    const form = document.getElementById('reportForm') as HTMLFormElement | null;
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement | null;
    const ageCategory = document.getElementById('ageCategory') as HTMLSelectElement | null;
    const locality = document.getElementById('locality') as HTMLSelectElement | null;

    // Setup autocomplete for team inputs
    setupAutocomplete('team_1', 'autocomplete_team_1');
    setupAutocomplete('team_2', 'autocomplete_team_2');

    // Handle locality changes
    locality?.addEventListener('change', handleLocalityChange);

    // Handle age category changes
    ageCategory?.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLSelectElement;
        updateFormFields(target.value);
    });

    // Handle form submission
    if (form && submitBtn) {
        form.addEventListener('submit', (event) => handleFormSubmit(event, form, submitBtn));
    }
}
