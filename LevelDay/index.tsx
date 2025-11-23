
// --- TYPES ---
interface Task {
    id: number;
    title: string;
    tag: string;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    description?: string;
    column: number;
    totalColumns: number;
    day?: number;
    month?: number;
    year?: number;
    completed?: boolean;
}
interface Annotation {
    id: number;
    time: string;
    text: string;
    tag?: string;
    startHour?: number;
    startMinute?: number;
    endHour?: number;
    endMinute?: number;
    description?: string;
    day?: number;
    month?: number;
    year?: number;
    isScheduled?: boolean;
}
interface Note {
    id: number;
    title: string;
    annotations: Annotation[];
}

// --- DATA ---
const TASKS_DATA: Task[] = [];
const NOTES_DATA: Note[] = [
    { id: 1, title: 'notas 1', annotations: [ { id: 101, time: '09:15', text: 'Primeira anotação.' }, { id: 102, time: '10:30', text: 'Segunda anotação sobre a tarefa B.' }, ] },
    { id: 2, title: 'notas 2', annotations: [ { id: 201, time: '11:05', text: 'Lembrar de verificar o email.' }, ] },
    { id: 3, title: 'notas 3', annotations: [] },
];
const DAY_START_HOUR = 0;
const DAY_END_HOUR = 24;

// --- STATE ---
let activeTab = 'Agenda';
let currentPage: 'perfil' | 'settings' | 'agenda' | 'notes' | 'noteDetail' | 'loja' = 'agenda';
let notes: Note[] = JSON.parse(JSON.stringify(NOTES_DATA));
let tasks: Task[] = JSON.parse(JSON.stringify(TASKS_DATA));
let selectedNote: Note | null = null;
let selectedAnnotationForEdit: Annotation | null = null;
let newAnnotationText = '';
let currentDate: Date = new Date();
let isCalendarOpen = false;
let selectedTask: Task | null = null;

// User Stats (Gamification)
let userCoins = 1250;
let userXP = 124821468;

// --- DOM ELEMENTS ---
const headerEl = document.getElementById('app-header')!;
const footerEl = document.getElementById('app-footer')!;
const perfilViewEl = document.getElementById('perfil-view')!;
const settingsViewEl = document.getElementById('settings-view')!;
const agendaViewEl = document.getElementById('agenda-view')!;
const notesViewEl = document.getElementById('notes-view')!;
const noteDetailViewEl = document.getElementById('note-detail-view')!;
const lojaViewEl = document.getElementById('loja-view')!;
const fab = document.getElementById('fab') as HTMLElement;
const annotationDetailModalEl = document.getElementById('annotation-detail-modal')!;
const calendarModalEl = document.getElementById('calendar-modal')!;
const taskDetailModalEl = document.getElementById('task-detail-modal')!;
const appContainerEl = document.getElementById('app-container')!;

const views = {
    'perfil': perfilViewEl,
    'settings': settingsViewEl,
    'agenda': agendaViewEl,
    'notes': notesViewEl,
    'noteDetail': noteDetailViewEl,
    'loja': lojaViewEl,
};

// --- JUICE ENGINE (Audio & Visual FX) ---

const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

function playSound(type: 'pop' | 'success' | 'click') {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;

    if (type === 'pop') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    } else if (type === 'success') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440, now); // A4
        oscillator.frequency.setValueAtTime(554, now + 0.1); // C#5
        oscillator.frequency.setValueAtTime(659, now + 0.2); // E5
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
    } else if (type === 'click') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(300, now);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        oscillator.start(now);
        oscillator.stop(now + 0.05);
    }
}

function triggerConfetti() {
    const colors = ['#f9c751', '#f08436', '#1eae89', '#343478', '#ffffff'];
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random properties
        const left = Math.random() * 100; // 0 to 100%
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 1 + 1.5; // 1.5s to 2.5s
        
        confetti.style.left = `${left}%`;
        confetti.style.backgroundColor = bg;
        confetti.style.animationDuration = `${duration}s`;
        confetti.style.top = '-10px'; // Start above screen
        
        appContainerEl.appendChild(confetti);
        
        // Cleanup
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
}

function vibrate(pattern: number | number[] = 10) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}


// --- ICONS (SVG Strings) ---
const SearchIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`;
const CalendarIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
const PlusIcon = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>`;
const CheckIcon = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
const SettingsIcon = `<svg class="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`;
const CoinIcon = `<div class="w-5 h-5 bg-[#f9c751] border-2 border-[#e4a82e] rounded-full flex items-center justify-center text-black font-bold text-xs mr-1">S</div>`;
const BadgeIcon = `<svg class="w-20 h-20" viewBox="0 0 100 100">
    <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="#343478"/>
    <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="#40408c" stroke="#f9c751" stroke-width="4"/>
    <path d="M50 35 L65 50 L50 65 L35 50 Z" fill="#f9c751"/>
</svg>`;
const MedalIcon = (colorClass: string) => `<i class="fas fa-medal text-4xl ${colorClass}"></i>`;
const ProfileIcon = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
const ShoppingBagIcon = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`;
const GoogleIcon = `<svg class="w-6 h-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.582-3.651-11.113-8.584l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.443-2.399 4.481-4.592 5.674l6.19 5.238C41.382 34.181 44 29.593 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>`;
const AppleIcon = `<svg class="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.16c-.05.01-.1.01-.15.02c-1.37.28-2.12 1.63-2.12 3.06c0 1.52.83 2.37 2.22 2.37c1.31 0 2.1-.8 2.1-2.28c0-2.22-2.18-3.17-4.25-3.17h-1.34c-2.83 0-4.14 1.77-4.14 4.17c0 2.82 1.63 4.22 4.2 4.22c1.24 0 2.11-.53 2.88-1.2l.02-.02c.04-.04.09-.08.13-.13c.12-.13.23-.28.32-.44l.01.01c-.13.06-.27.1-.41.13c-1.12.24-2.03 1.25-2.03 2.45c0 1.33.91 2.2 2.17 2.2c1.28 0 2.13-.88 2.13-2.13c0-1.7-1.1-2.61-2.88-2.95c-1.44-.28-2.29-1.08-2.29-2.35c0-1.31.95-2.14 2.24-2.14c1.18 0 2.01.78 2.05 2.05c-1.78.11-2.19 1.2-2.19 1.95zm-9.3-5.32c-.01-.01-.02-.02-.03-.03c-1.57-1.73-3.6-2.1-5.02-2.13c-2.42 0-4.43 1.84-4.43 4.39c0 2.65 2.16 4.41 4.38 4.41c.42 0 .83-.07 1.23-.21c1.55-.56 2.35-2.22 2.35-3.69c0-1.2-.55-2.08-1.5-2.74zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12s12-5.37 12-12S18.63 0 12 0z"/></svg>`;
const ArrowLeftIcon = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>`;
const ChevronLeftIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>`;
const ChevronRightIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;
const UserCircleIcon = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
const LockIcon = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
const BellIcon = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;
const LanguageIcon = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>`;
const ThemeIcon = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

// --- DATE HELPERS ---
const monthNames = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
const dayNames = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];

function formatDate(date: Date) {
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const dayOfWeek = dayNames[date.getDay()];
    return { day, month, dayOfWeek };
}

// --- RENDER FUNCTIONS ---
function renderHeader() {
    let content = '';
    const isEditing = newAnnotationText.length > 0;
    
    const baseHeaderClasses = "p-4 flex items-center justify-between h-full border-b border-orange-700 bg-[#f08436]";

    if (activeTab === 'Perfil') {
        if (currentPage === 'settings') {
             content = `
            <div class="${baseHeaderClasses}">
                <button id="back-btn" class="text-gray-300 hover:text-white">${ArrowLeftIcon}</button>
                <h1 class="text-xl font-semibold text-gray-100">CONFIGURAÇÕES</h1>
                <div class="w-8"></div>
            </div>
            `;
        } else {
            content = `
            <div class="${baseHeaderClasses}">
                <h1 class="text-3xl font-light tracking-wider text-gray-100">PERFIL</h1>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center bg-black bg-opacity-20 rounded-full px-3 py-1 border border-orange-500">
                        ${CoinIcon}
                        <span id="header-coins" class="font-semibold ml-1 text-gray-100">${userCoins}</span>
                    </div>
                    <button id="settings-btn">${SettingsIcon}</button>
                </div>
            </div>
            `;
        }
    } else if (activeTab === 'Loja') {
        content = `
        <div class="${baseHeaderClasses}">
            <h1 class="text-3xl font-light tracking-wider text-gray-100">LOJA</h1>
            <div class="flex items-center space-x-4">
                 <div class="flex items-center bg-black bg-opacity-20 rounded-full px-3 py-1 border border-orange-500">
                    ${CoinIcon}
                    <span class="font-semibold ml-1 text-gray-100">${userCoins}</span>
                </div>
                <button class="text-gray-300">${SearchIcon.replace('w-6 h-6', 'w-8 h-8')}</button>
            </div>
        </div>
        `;
    } else { // Agenda logic
        if (currentPage === 'noteDetail' && selectedNote) {
            content = `
                <div class="${baseHeaderClasses}">
                    <h1 class="text-2xl font-normal text-gray-100 tracking-wide capitalize">${selectedNote.title}</h1>
                    <div class="flex items-center space-x-4">
                        <button class="text-gray-300 hover:text-white">${SearchIcon.replace('w-6 h-6', 'w-7 h-7')}</button>
                        ${isEditing ? `<button id="done-btn" class="text-gray-300 hover:text-white" aria-label="Finish editing">${CheckIcon}</button>` : ''}
                    </div>
                </div>`;
        } else if (currentPage === 'notes') {
            content = `
                <div class="${baseHeaderClasses}">
                    <h1 class="text-lg font-semibold text-gray-100 tracking-wider">BLOCO DE NOTAS</h1>
                    <div class="flex items-center space-x-4">
                        <button class="text-gray-300 hover:text-white">${SearchIcon.replace('w-6 h-6', 'w-7 h-7')}</button>
                        <button class="text-gray-300 hover:text-white">${PlusIcon}</button>
                    </div>
                </div>`;
        } else { // Agenda
            const { day, month, dayOfWeek } = formatDate(currentDate);
            content = `
                <div class="${baseHeaderClasses}">
                    <div class="flex items-center">
                        <span class="text-5xl font-light text-gray-100">${String(day).padStart(2, '0')}</span>
                        <div class="ml-3">
                            <p class="text-sm font-semibold text-orange-200 tracking-wider">${month}, ${dayOfWeek}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button class="text-gray-300 hover:text-white">${SearchIcon}</button>
                        <button id="calendar-btn" class="text-gray-300 hover:text-white">${CalendarIcon}</button>
                    </div>
                </div>`;
        }
    }
    headerEl.innerHTML = content;

    // Attach listeners after render
    document.getElementById('settings-btn')?.addEventListener('click', handleOpenSettings);
    document.getElementById('back-btn')?.addEventListener('click', handleCloseSettings);
    document.getElementById('done-btn')?.addEventListener('click', handleDoneClick);
    document.getElementById('calendar-btn')?.addEventListener('click', handleOpenCalendar);
}

function calculateTaskLayout(tasksForDay: Task[]): Task[] {
    if (tasksForDay.length === 0) return [];
    
    // Sort tasks by start time, then by duration (longer tasks first)
    tasksForDay.sort((a, b) => {
        const aStart = a.startHour * 60 + a.startMinute;
        const bStart = b.startHour * 60 + b.startMinute;
        if (aStart !== bStart) return aStart - bStart;
        const aDuration = (a.endHour * 60 + a.endMinute) - aStart;
        const bDuration = (b.endHour * 60 + b.endMinute) - bStart;
        return bDuration - aDuration;
    });

    const processedTasks: Task[] = [];
    for (const task of tasksForDay) {
        let placed = false;
        let col = 0;
        while (!placed) {
            let hasOverlapInCol = false;
            for (const processed of processedTasks) {
                if (processed.column === col) {
                    const taskStart = task.startHour * 60 + task.startMinute;
                    const taskEnd = task.endHour * 60 + task.endMinute;
                    const processedStart = processed.startHour * 60 + processed.startMinute;
                    const processedEnd = processed.endHour * 60 + processed.endMinute;
                    // Check for overlap (exclusive end time)
                    if (taskStart < processedEnd && taskEnd > processedStart) {
                        hasOverlapInCol = true;
                        break;
                    }
                }
            }
            if (!hasOverlapInCol) {
                task.column = col;
                placed = true;
            } else {
                col++;
            }
        }
        processedTasks.push(task);
    }
    
    // Determine total columns for each group of overlapping tasks
    for (let i = 0; i < processedTasks.length; i++) {
        const taskA = processedTasks[i];
        let maxColumns = 1;
        const overlappingTasks = [taskA];

        for (let j = 0; j < processedTasks.length; j++) {
            if (i === j) continue;
            const taskB = processedTasks[j];
            const aStart = taskA.startHour * 60 + taskA.startMinute;
            const aEnd = taskA.endHour * 60 + taskA.endMinute;
            const bStart = taskB.startHour * 60 + taskB.startMinute;
            const bEnd = taskB.endHour * 60 + taskB.endMinute;

            if (aStart < bEnd && aEnd > bStart) {
                overlappingTasks.push(taskB);
            }
        }
        maxColumns = Math.max(...overlappingTasks.map(t => t.column)) + 1;
        taskA.totalColumns = maxColumns;
    }
    
    return processedTasks;
}

function renderAgendaView() {
    const hours = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, i) => DAY_START_HOUR + i);
    const totalMinutes = (DAY_END_HOUR - DAY_START_HOUR) * 60;

    const timeColumnHTML = `
        <div class="w-20 text-right pr-2 pt-2 border-r border-yellow-600">
            <div class="flex flex-col h-full pt-4">
                ${hours.map(hour => `
                    <div class="flex-1 -mt-px flex justify-end items-start" style="min-height: 60px;">
                        <span class="text-xs text-yellow-900 font-medium transform -translate-y-1.5">${String(hour).padStart(2, '0')}:00</span>
                    </div>
                `).join('')}
                 <div class="flex-1 -mt-px flex justify-end items-start" style="min-height: 60px;">
                    </div>
            </div>
        </div>`;
    
    const tasksForDay = tasks.filter(task =>
        task.year === currentDate.getFullYear() &&
        task.month === (currentDate.getMonth() + 1) &&
        task.day === currentDate.getDate()
    );

    const laidOutTasks = calculateTaskLayout(tasksForDay);
    
    const tagColors: { [key: string]: string } = {
        'A': 'bg-[#f9c751]',
        'B': 'bg-[#f08436]',
        'C': 'bg-[#ed6b2d]',
    };

    const scheduleGridHTML = `
        <div class="flex-1 relative">
            <!-- Horizontal lines -->
            ${[...hours, DAY_END_HOUR].map(() => `<div class="h-[60px] border-b border-yellow-600"></div>`).join('')}
            <!-- Tasks -->
            <div id="task-container" class="absolute top-0 left-0 right-0 bottom-0">
                ${laidOutTasks.map(task => {
                    const startOffsetMinutes = (task.startHour - DAY_START_HOUR) * 60 + task.startMinute;
                    const durationMinutes = (task.endHour * 60 + task.endMinute) - (task.startHour * 60 + task.startMinute);
                    const topPercent = (startOffsetMinutes / totalMinutes) * 100;
                    const heightPercent = (durationMinutes / totalMinutes) * 100;
                    
                    const widthPercent = 100 / task.totalColumns;
                    const leftPercent = task.column * widthPercent;
                    
                    const tagColor = tagColors[task.tag] || 'bg-gray-400';
                    const isCompleted = task.completed;
                    const bgClass = isCompleted ? 'bg-gray-400' : 'bg-[#85cd39]';
                    const opacityClass = isCompleted ? 'opacity-75' : '';
                    const titleStyle = isCompleted ? 'text-decoration: line-through;' : '';

                    return `
                        <div class="task-item absolute ${bgClass} ${opacityClass} rounded-md p-2 flex justify-between items-start text-white shadow-md cursor-pointer hover:shadow-lg transition-all"
                             data-task-id="${task.id}"
                             style="top: calc(${topPercent}% + 2px); height: calc(${heightPercent}% - 4px); left: calc(${leftPercent}% + 4px); width: calc(${widthPercent}% - 8px); min-height: 2rem;">
                            <div class="w-full">
                                <p class="text-sm font-bold" style="${titleStyle}">${task.title}</p>
                                ${task.description ? `<p class="text-xs text-green-100 mt-1"><span class="inline-block mr-1">•</span>${task.description}</p>` : ''}
                            </div>
                            <div class="relative h-full flex items-center justify-center w-8 text-white font-bold text-lg -mr-2">
                                <div class="absolute inset-0 ${tagColor} task-tag-shape"></div>
                                <span class="relative z-10 ${isCompleted ? 'opacity-50' : ''}">${isCompleted ? '✓' : task.tag}</span>
                            </div>
                        </div>`;
                }).join('')}
            </div>
        </div>`;
    
    agendaViewEl.innerHTML = `<div class="flex h-full bg-[#f9c751]">${timeColumnHTML}${scheduleGridHTML}</div>`;
    
    document.getElementById('task-container')?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const taskEl = target.closest('.task-item');
        if (taskEl) {
            const taskId = taskEl.getAttribute('data-task-id');
            if (taskId) {
                handleTaskSelect(parseInt(taskId, 10));
            }
        }
    });
}

function renderAnnotationDetailModal() {
    if (!selectedAnnotationForEdit) {
        annotationDetailModalEl.innerHTML = '';
        return;
    }

    const annotation = selectedAnnotationForEdit;
    
    const modalContent = `
    <div class="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 animate-fade-in" id="modal-backdrop-annotation">
        <div class="bg-white text-gray-800 rounded-lg shadow-xl w-full max-w-sm p-5 flex flex-col gap-4" onclick="event.stopPropagation()">
            <!-- Header -->
            <div class="relative bg-[#f08436] -m-5 mb-0 rounded-t-lg p-4 h-16 flex items-center">
                <input type="text" name="text" value="${annotation.text}" class="bg-transparent text-lg font-semibold text-gray-100 placeholder-gray-400 focus:outline-none w-2/3" placeholder="Título da Tarefa">
                <div class="absolute right-0 top-0 h-full w-20 bg-[#1eae89] flex items-center justify-center task-priority-shape">
                    <span class="text-white text-3xl font-bold">${annotation.tag || 'A'}</span>
                </div>
            </div>

            <!-- Date & Time -->
            <div class="grid grid-cols-2 gap-4 pt-2">
                <div>
                    <label class="text-xs uppercase tracking-wider text-gray-500">Data</label>
                    <div class="flex gap-2 mt-1">
                        <input name="day" type="text" placeholder="DD" value="${annotation.day || ''}" maxlength="2" class="w-full h-10 text-center bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1eae89]">
                        <input name="month" type="text" placeholder="MM" value="${annotation.month || ''}" maxlength="2" class="w-full h-10 text-center bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1eae89]">
                        <input name="year" type="text" placeholder="AAAA" value="${annotation.year || ''}" maxlength="4" class="w-full h-10 text-center bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1eae89]">
                    </div>
                </div>
                <div>
                    <label class="text-xs uppercase tracking-wider text-gray-500">Horário</label>
                    <div class="flex items-center gap-1 mt-1">
                        <input name="startTime" type="time" value="${String(annotation.startHour || '09').padStart(2, '0')}:${String(annotation.startMinute || '00').padStart(2, '0')}" class="w-full h-10 px-1 text-center bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1eae89] appearance-none">
                        <span class="text-xs text-gray-400">-</span>
                        <input name="endTime" type="time" value="${String(annotation.endHour || '10').padStart(2, '0')}:${String(annotation.endMinute || '00').padStart(2, '0')}" class="w-full h-10 px-1 text-center bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1eae89] appearance-none">
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div>
                <label class="text-xs uppercase tracking-wider text-gray-500">Descrição</label>
                <textarea name="description" class="w-full h-20 bg-gray-100 text-gray-800 rounded-md mt-1 p-2 focus:outline-none focus:ring-2 focus:ring-[#1eae89] resize-none" placeholder="Adicione uma descrição...">${annotation.description || ''}</textarea>
            </div>

            <!-- Priority -->
            <div>
                <label class="text-xs uppercase tracking-wider text-gray-500">Ranking de prioridade</label>
                <div class="grid grid-cols-3 gap-3 mt-2">
                    <button data-priority="A" class="priority-btn py-2 rounded-md text-lg font-bold transition-colors ${annotation.tag === 'A' ? 'bg-[#f9c751] text-black' : 'bg-gray-200 hover:bg-gray-300'}">A</button>
                    <button data-priority="B" class="priority-btn py-2 rounded-md text-lg font-bold transition-colors ${annotation.tag === 'B' ? 'bg-[#f08436] text-white' : 'bg-gray-200 hover:bg-gray-300'}">B</button>
                    <button data-priority="C" class="priority-btn py-2 rounded-md text-lg font-bold transition-colors ${annotation.tag === 'C' ? 'bg-[#ed6b2d] text-white' : 'bg-gray-200 hover:bg-gray-300'}">C</button>
                </div>
            </div>
            
            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-2">
                <button id="cancel-annotation-btn" class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors">Cancelar</button>
                <button id="save-annotation-btn" class="px-4 py-2 rounded-md bg-[#1eae89] hover:bg-[#189a79] text-white font-semibold transition-colors">Enviar para Agenda</button>
            </div>
        </div>
    </div>
    `;

    annotationDetailModalEl.innerHTML = modalContent;

    // Add event listeners
    document.getElementById('modal-backdrop-annotation')?.addEventListener('click', handleCloseAnnotationModal);
    document.getElementById('save-annotation-btn')?.addEventListener('click', handleSaveAnnotationAndSchedule);
    document.getElementById('cancel-annotation-btn')?.addEventListener('click', handleCloseAnnotationModal);
    
    annotationDetailModalEl.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', (e) => {
            if (!selectedAnnotationForEdit) return;
            const target = e.target as HTMLInputElement | HTMLTextAreaElement;
            const name = target.name;
            let value: string | number | undefined = target.value;

            if (target.type === 'time') {
                const [h, m] = target.value.split(':').map(Number);
                if (name === 'startTime') {
                    selectedAnnotationForEdit.startHour = h;
                    selectedAnnotationForEdit.startMinute = m;
                } else if (name === 'endTime') {
                    selectedAnnotationForEdit.endHour = h;
                    selectedAnnotationForEdit.endMinute = m;
                }
            } else if (name === 'day' || name === 'month' || name === 'year') {
                 (selectedAnnotationForEdit as any)[name] = value === '' ? undefined : parseInt(value);
            } else {
                (selectedAnnotationForEdit as any)[name] = value;
            }
        });
    });

    annotationDetailModalEl.querySelectorAll('.priority-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const priority = (e.currentTarget as HTMLElement).dataset.priority;
            if (priority && selectedAnnotationForEdit) {
                selectedAnnotationForEdit.tag = priority;
                renderAnnotationDetailModal(); // Re-render modal to update styles
            }
        });
    });
}

function renderNotesView() {
    const content = `
        <div class="bg-[#f9c751] min-h-full p-6">
            <div class="grid grid-cols-2 gap-6">
                ${notes.map(note => `
                    <button data-note-id="${note.id}" class="note-card bg-[#40408c] rounded-2xl shadow-lg p-4 flex items-center justify-center aspect-square transition-transform hover:scale-105 w-full text-left">
                        <p class="text-gray-100 text-lg capitalize">${note.title}</p>
                    </button>
                `).join('')}
            </div>
        </div>`;
    notesViewEl.innerHTML = content;
    
    document.querySelectorAll('.note-card').forEach(card => {
        card.addEventListener('click', (e) => {
            playSound('click');
            const noteId = (e.currentTarget as HTMLElement).dataset.noteId;
            if (noteId) {
                handleNoteSelect(parseInt(noteId, 10));
            }
        });
    });
}

function renderNoteDetailView() {
    if (!selectedNote) {
        noteDetailViewEl.innerHTML = `<p class="bg-[#f9c751] h-full p-6 text-gray-500">Note not found.</p>`;
        return;
    }

    const annotationsHTML = selectedNote.annotations.length > 0
        ? selectedNote.annotations.map(ann => `
            <div data-annotation-id="${ann.id}" class="annotation-item flex items-center bg-white rounded-md shadow-sm mb-4 overflow-hidden h-12 ${ann.isScheduled ? 'opacity-60 cursor-default' : 'cursor-pointer hover:bg-gray-50 transition-colors'}">
                <div class="bg-[#1eae89] text-white text-sm py-3 px-4 w-24 flex items-center justify-center">
                    <span>${ann.time}</span>
                </div>
                <div class="flex-grow py-3 px-4 text-gray-800 text-lg">
                    <span>${ann.text}</span>
                </div>
                ${ann.isScheduled ? `<div class="pr-3 text-gray-400">${CalendarIcon.replace('w-6 h-6', 'w-5 h-5')}</div>` : ''}
            </div>
        `).join('')
        : `<div class="flex items-center justify-center h-full"><p class="text-gray-800 opacity-70">Nenhuma anotação ainda.</p></div>`;

    const content = `
        <div class="bg-[#f9c751] h-full flex flex-col relative">
            <div id="annotations-list" class="flex-grow overflow-y-auto no-scrollbar draggable-scroll-vertical cursor-grab p-6 pb-24">${annotationsHTML}</div>
            <div class="absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200">
                <textarea id="annotation-input" class="w-full text-lg text-gray-800 bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1eae89] resize-none"
                          placeholder="Escreva uma anotação..." aria-label="New annotation" rows="1">${newAnnotationText}</textarea>
            </div>
        </div>`;
    noteDetailViewEl.innerHTML = content;
    
    document.getElementById('annotations-list')?.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const annotationEl = target.closest('.annotation-item');
        if (annotationEl) {
            const annotationId = annotationEl.getAttribute('data-annotation-id');
            const isScheduled = selectedNote?.annotations.find(a => a.id === parseInt(annotationId!))?.isScheduled;
            if (annotationId && !isScheduled) {
                playSound('click');
                handleAnnotationSelect(parseInt(annotationId, 10));
            }
        }
    });

    const textarea = document.getElementById('annotation-input') as HTMLTextAreaElement | null;
    if (textarea) {
        textarea.addEventListener('input', (e) => {
            newAnnotationText = (e.target as HTMLTextAreaElement).value;
            renderHeader();
        });
        // Don't auto focus on mobile/touch usually, but here requested
        // textarea.focus();
        // textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
}

function renderPerfilView() {
    const medals = ['text-[#f9c751]', 'text-[#f9c751]', 'text-[#f08436]', 'text-[#1eae89]', 'text-gray-400', 'text-gray-400', 'text-gray-400', 'text-gray-400'];
    perfilViewEl.innerHTML = `
    <div class="bg-[#f9c751] min-h-full text-gray-800 pb-8">
        <!-- Profile Photo Area (Full Width Dark) -->
        <div class="bg-[#404040] w-full h-52 flex items-center justify-center relative">
             <div class="w-36 h-36 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                 <svg class="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div>
        </div>

        <!-- Name, Stats & Button (Integrated Section) -->
        <div class="flex flex-col items-center pt-4 pb-6">
             <h2 class="text-3xl text-gray-800 font-normal mb-3">nome</h2>
             
             <div class="flex justify-center space-x-8 text-sm text-gray-600 mb-5">
                <p><span class="font-bold text-gray-900">590</span> Seguidores</p>
                <span class="border-r border-gray-500 h-4 self-center"></span>
                <p><span class="font-bold text-gray-900">870</span> Seguindo</p>
            </div>

            <button class="bg-[#d4d4d4] text-gray-700 font-bold text-sm px-8 py-2 rounded-full hover:bg-gray-300 transition-colors shadow-sm uppercase tracking-wider">ADD AMIGOS</button>
        </div>

        <!-- Ranking Section (Separate) -->
        <div class="flex flex-col items-center mb-6">
             ${BadgeIcon}
             <div class="w-48 bg-black bg-opacity-10 rounded-full h-2.5 mt-2">
                <div class="bg-[#343478] h-2.5 rounded-full" style="width: 75%"></div>
            </div>
            <p class="text-sm mt-1 text-gray-800 font-bold">${userXP} XP</p>
        </div>

        <!-- Additional Cards -->
        <div class="px-4 space-y-4">
             <!-- Conquistas -->
            <div class="bg-white bg-opacity-30 rounded-lg shadow-sm p-4 backdrop-blur-sm border border-white/20">
                <h3 class="font-semibold text-lg mb-2 text-gray-800">Conquistas</h3>
                <div class="grid grid-cols-4 gap-4 justify-items-center">
                    ${medals.map(color => MedalIcon(color)).join('')}
                </div>
            </div>

            <!-- EXP da semana -->
            <div class="bg-white bg-opacity-30 rounded-lg shadow-sm p-4 backdrop-blur-sm border border-white/20">
                <h3 class="font-semibold text-lg mb-2 text-gray-800">EXP da semana</h3>
                <div class="flex justify-around items-center h-40">
                    <div class="w-1/2 h-full bg-white bg-opacity-40 p-2 rounded-lg border border-gray-200/50">
                        <svg class="w-full h-full" viewBox="0 0 100 50">
                            <polyline fill="none" stroke="#f08436" stroke-width="2" points="5,45 15,35 25,40 35,25 45,30 55,20 65,15 75,25 85,10 95,5" />
                            <line x1="5" y1="48" x2="95" y2="48" stroke="#9ca3af" stroke-width="1" />
                            <line x1="5" y1="48" x2="5" y2="5" stroke="#9ca3af" stroke-width="1" />
                        </svg>
                    </div>
                    <div class="w-1/3 h-full flex items-center justify-center">
                         <svg class="w-24 h-24" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1eae89" stroke-width="4" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 11.25 4.66" fill="none" stroke="#f9c751" stroke-width="4" stroke-dasharray="25, 100"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function renderSettingsView() {
    settingsViewEl.innerHTML = `
    <div class="bg-[#f9c751] min-h-full text-gray-800 space-y-4 pt-4">
        <!-- Account Section -->
        <div class="px-4">
            <h3 class="text-sm font-semibold text-gray-500 mb-2 px-2">CONTA</h3>
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <a href="#" class="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors">
                    <div class="flex items-center">
                        <span class="mr-4 text-gray-500">${UserCircleIcon}</span>
                        <span>Editar Perfil</span>
                    </div>
                    <span class="text-gray-400">${ChevronRightIcon}</span>
                </a>
                <a href="#" class="flex items-center justify-between p-4 hover:bg-gray-100 transition-colors">
                    <div class="flex items-center">
                        <span class="mr-4 text-gray-500">${LockIcon}</span>
                        <span>Alterar Senha</span>
                    </div>
                    <span class="text-gray-400">${ChevronRightIcon}</span>
                </a>
            </div>
        </div>
        <!-- Notifications Section -->
        <div class="px-4">
            <h3 class="text-sm font-semibold text-gray-500 mb-2 px-2">NOTIFICAÇÕES</h3>
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <div class="flex items-center">
                        <span class="mr-4 text-gray-500">${BellIcon}</span>
                        <span>Notificações Push</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" class="sr-only peer" checked>
                      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1eae89]"></div>
                    </label>
                </div>
            </div>
        </div>
         <!-- General Section -->
        <div class="px-4">
            <h3 class="text-sm font-semibold text-gray-500 mb-2 px-2">GERAL</h3>
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                 <a href="#" class="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors">
                    <div class="flex items-center">
                        <span class="mr-4 text-gray-500">${LanguageIcon}</span>
                        <span>Idioma</span>
                    </div>
                    <span class="text-gray-400">${ChevronRightIcon}</span>
                </a>
                <a href="#" class="flex items-center justify-between p-4 hover:bg-gray-100 transition-colors">
                    <div class="flex items-center">
                        <span class="mr-4 text-gray-500">${ThemeIcon}</span>
                        <span>Tema</span>
                    </div>
                    <span class="text-gray-400">${ChevronRightIcon}</span>
                </a>
            </div>
        </div>
        <!-- Logout -->
        <div class="px-4 pt-4">
            <div class="bg-white rounded-lg shadow-sm">
                <button class="w-full text-left p-4 text-red-500 font-semibold hover:bg-red-50 rounded-lg transition-colors flex justify-center">
                    Sair
                </button>
            </div>
        </div>
    </div>
    `;
}

function renderLojaView() {
    const cosmeticItems = Array(8).fill('<div class="flex-shrink-0 w-24 h-24 bg-white border border-gray-200 rounded-md shadow-sm"></div>').join('');
    lojaViewEl.innerHTML = `
    <div class="bg-[#f9c751] min-h-full text-gray-800 p-4">
        <!-- Tabs -->
        <div class="grid grid-cols-3 gap-2 mb-6">
            <button class="bg-[#1eae89] py-2 rounded-md text-sm font-medium text-white shadow-sm">SEÇÃO 1</button>
            <button class="bg-white py-2 rounded-md text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-100">SEÇÃO 2</button>
            <button class="bg-white py-2 rounded-md text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-100">SEÇÃO 3</button>
        </div>

        <!-- Cosmetic Sections -->
        <div class="space-y-8">
            <div>
                <h3 class="text-xl text-gray-800 font-semibold mb-3">COSMETICO 1</h3>
                <div class="flex space-x-4 overflow-x-auto pb-3 no-scrollbar draggable-scroll-horizontal cursor-grab">
                    ${cosmeticItems}
                </div>
            </div>
            <div>
                <h3 class="text-xl text-gray-800 font-semibold mb-3">COSMETICO 2</h3>
                <div class="flex space-x-4 overflow-x-auto pb-3 no-scrollbar draggable-scroll-horizontal cursor-grab">
                    ${cosmeticItems}
                </div>
            </div>
            <div>
                <h3 class="text-xl text-gray-800 font-semibold mb-3">COSMETICO 3</h3>
                <div class="flex space-x-4 overflow-x-auto pb-3 no-scrollbar draggable-scroll-horizontal cursor-grab">
                    ${cosmeticItems}
                </div>
            </div>
        </div>
    </div>
    `;
}

function renderFooter() {
    const tabs = [
        { name: 'Perfil', icon: ProfileIcon },
        { name: 'Agenda', icon: CalendarIcon.replace('w-6 h-6', 'w-7 h-7').replace('stroke-width="2"', 'stroke-width="1.5"') },
        { name: 'Loja', icon: ShoppingBagIcon }
    ];
    footerEl.innerHTML = `<div class="bg-[#f08436] border-t border-orange-700 grid grid-cols-3 h-full">
        ${tabs.map(tab => `
            <button data-tab="${tab.name}" class="footer-tab py-4 flex items-center justify-center transition-colors duration-200
                ${activeTab === tab.name ? 'bg-[#ed6b2d] text-white' : 'text-orange-200 hover:bg-orange-700'}">
                ${tab.icon}
            </button>
        `).join('')}
        </div>`;
}

function renderCalendarModal() {
    if (!isCalendarOpen) {
        calendarModalEl.innerHTML = '';
        return;
    }

    const today = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    const daysGrid = Array(firstDay).fill(`<div class="w-10 h-10"></div>`).concat(
        Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = day === currentDate.getDate();
            let dayClasses = 'w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors text-gray-800 ';
            if (isSelected) {
                dayClasses += 'bg-[#1eae89] text-white font-bold';
            } else if (isToday) {
                dayClasses += 'bg-[#f9c751] text-black font-semibold';
            } else {
                dayClasses += 'hover:bg-gray-200';
            }
            return `<button data-day="${day}" class="${dayClasses}">${day}</button>`;
        })
    ).join('');

    calendarModalEl.innerHTML = `
        <div id="calendar-backdrop" class="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-sm p-4 animate-fade-in" onclick="event.stopPropagation()">
                <div class="flex items-center justify-between mb-4">
                    <button id="prev-month-btn" class="p-2 rounded-full hover:bg-gray-200 text-gray-600">${ChevronLeftIcon}</button>
                    <h3 class="text-lg font-semibold text-gray-800">${monthNames[month]} ${year}</h3>
                    <button id="next-month-btn" class="p-2 rounded-full hover:bg-gray-200 text-gray-600">${ChevronRightIcon}</button>
                </div>
                <div class="grid grid-cols-7 gap-y-2 text-center text-sm text-gray-500 font-medium mb-2">
                    ${weekdays.map(d => `<div>${d}</div>`).join('')}
                </div>
                <div class="grid grid-cols-7 gap-y-2 text-center">
                    ${daysGrid}
                </div>
                <div class="flex justify-end mt-4">
                    <button id="today-btn" class="px-4 py-2 text-sm font-semibold text-[#85cd39] hover:bg-gray-100 rounded-md">Hoje</button>
                    <button id="close-calendar-btn" class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md">Fechar</button>
                </div>
            </div>
        </div>`;

    document.getElementById('calendar-backdrop')?.addEventListener('click', handleCloseCalendar);
    document.getElementById('close-calendar-btn')?.addEventListener('click', handleCloseCalendar);
    document.getElementById('prev-month-btn')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        render();
    });
    document.getElementById('next-month-btn')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        render();
    });
    document.getElementById('today-btn')?.addEventListener('click', () => {
        currentDate = new Date();
        handleCloseCalendar();
    });
    calendarModalEl.querySelectorAll('[data-day]').forEach(btn => {
        btn.addEventListener('click', e => {
            const day = (e.currentTarget as HTMLElement).dataset.day;
            if (day) {
                currentDate.setDate(parseInt(day, 10));
                handleCloseCalendar();
            }
        });
    });
}

function renderTaskDetailModal() {
    if (!selectedTask) {
        taskDetailModalEl.innerHTML = '';
        return;
    }

    const formatTime = (hour: number, minute: number) => `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    const isCompleted = selectedTask.completed;
    
    taskDetailModalEl.innerHTML = `
     <div class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" id="task-modal-backdrop">
        <div class="bg-white text-gray-800 rounded-lg shadow-xl w-full max-w-sm flex flex-col animate-fade-in" onclick="event.stopPropagation()">
            <div class="relative bg-[#f08436] text-gray-100 rounded-t-lg p-4 h-16 flex items-center">
                <h2 class="text-lg font-semibold w-2/3 truncate">${selectedTask.title}</h2>
                <div class="absolute right-0 top-0 h-full w-20 bg-[#1eae89] flex items-center justify-center task-priority-shape">
                    <span class="text-white text-3xl font-bold">${selectedTask.tag}</span>
                </div>
            </div>
            <div class="p-5 space-y-4">
                <div>
                    <label class="text-xs uppercase tracking-wider text-gray-500">Horário</label>
                    <p class="text-lg mt-1">${formatTime(selectedTask.startHour, selectedTask.startMinute)} - ${formatTime(selectedTask.endHour, selectedTask.endMinute)}</p>
                </div>
                 ${selectedTask.description ? `
                <div>
                    <label class="text-xs uppercase tracking-wider text-gray-500">Descrição</label>
                    <p class="text-base mt-1 bg-gray-100 p-2 rounded-md border border-gray-200">${selectedTask.description}</p>
                </div>
                ` : ''}
                
                <!-- Completion Reward Section -->
                <div class="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
                    <div class="flex items-center text-sm text-gray-500">
                         <span>Recompensa:</span>
                         <div class="flex items-center ml-2 text-[#f08436] font-bold">
                            ${CoinIcon} +50
                         </div>
                    </div>
                    <div class="flex gap-2">
                         <button id="close-task-modal-btn" class="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">Fechar</button>
                         ${!isCompleted ? 
                            `<button id="complete-task-btn" class="px-4 py-2 rounded-md bg-[#1eae89] hover:bg-[#189a79] text-white font-bold transition-colors shadow-sm">
                                CONCLUIR
                            </button>` : 
                            `<button disabled class="px-4 py-2 rounded-md bg-gray-300 text-white font-bold cursor-not-allowed">
                                CONCLUÍDA
                            </button>`
                         }
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.getElementById('task-modal-backdrop')?.addEventListener('click', handleCloseTaskModal);
    document.getElementById('close-task-modal-btn')?.addEventListener('click', handleCloseTaskModal);
    
    const completeBtn = document.getElementById('complete-task-btn');
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            if (selectedTask) {
                completeTask(selectedTask.id);
            }
        });
    }
}

function completeTask(taskId: number) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = true;
        
        // Juice
        playSound('success');
        triggerConfetti();
        vibrate([50, 100, 50]);
        
        // Rewards
        userCoins += 50;
        userXP += 100;

        // Close modal immediately to show effect on grid
        handleCloseTaskModal();
        
        // Wait a bit for modal close animation (if any) then update UI
        setTimeout(() => {
            const taskEl = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskEl) {
                taskEl.classList.add('animate-shake');
                taskEl.addEventListener('animationend', () => {
                     taskEl.classList.remove('animate-shake');
                });
            }
            
            // Animate coins in header if visible
            const coinEl = document.getElementById('header-coins');
            if (coinEl) {
                coinEl.classList.add('animate-bounce-text');
                coinEl.addEventListener('animationend', () => {
                    coinEl.classList.remove('animate-bounce-text');
                });
            }
        }, 100);
    }
}

// --- EVENT HANDLERS ---
function handleOpenSettings() {
    playSound('click');
    currentPage = 'settings';
    render();
}
function handleCloseSettings() {
    playSound('click');
    currentPage = 'perfil';
    render();
}
function handleOpenCalendar() {
    playSound('click');
    isCalendarOpen = true;
    render();
}
function handleCloseCalendar() {
    playSound('click');
    isCalendarOpen = false;
    render();
}
function handleTaskSelect(taskId: number) {
    playSound('click');
    selectedTask = tasks.find(t => t.id === taskId) || null;
    render();
}
function handleCloseTaskModal() {
    selectedTask = null;
    render();
}

function handleAnnotationSelect(annotationId: number) {
    if (!selectedNote) return;
    const annotation = selectedNote.annotations.find(a => a.id === annotationId);
    if (annotation) {
        selectedAnnotationForEdit = JSON.parse(JSON.stringify(annotation));

        if (selectedAnnotationForEdit.isScheduled === undefined) {
            selectedAnnotationForEdit.isScheduled = false;
        }
        if (selectedAnnotationForEdit.tag === undefined) {
            selectedAnnotationForEdit.tag = 'A';
        }
        const now = new Date();
        if (selectedAnnotationForEdit.day === undefined) {
            selectedAnnotationForEdit.day = now.getDate();
        }
        if (selectedAnnotationForEdit.month === undefined) {
            selectedAnnotationForEdit.month = now.getMonth() + 1;
        }
        if (selectedAnnotationForEdit.year === undefined) {
            selectedAnnotationForEdit.year = now.getFullYear();
        }
        if (selectedAnnotationForEdit.startHour === undefined) {
            selectedAnnotationForEdit.startHour = 9;
            selectedAnnotationForEdit.startMinute = 0;
        }
        if (selectedAnnotationForEdit.endHour === undefined) {
            selectedAnnotationForEdit.endHour = 10;
            selectedAnnotationForEdit.endMinute = 0;
        }
        render();
    }
}

function handleSaveAnnotationAndSchedule() {
    playSound('pop');
    if (selectedAnnotationForEdit) {
        const note = notes.find(n => n.id === selectedNote?.id);
        if (note) {
            const annotationIndex = note.annotations.findIndex(a => a.id === selectedAnnotationForEdit!.id);
            if (annotationIndex !== -1) {
                note.annotations[annotationIndex] = selectedAnnotationForEdit;
                note.annotations[annotationIndex].isScheduled = true;
            }
        }

        const newTask: Task = {
            id: Date.now(),
            title: selectedAnnotationForEdit.text,
            tag: selectedAnnotationForEdit.tag!,
            startHour: selectedAnnotationForEdit.startHour!,
            startMinute: selectedAnnotationForEdit.startMinute!,
            endHour: selectedAnnotationForEdit.endHour!,
            endMinute: selectedAnnotationForEdit.endMinute!,
            description: selectedAnnotationForEdit.description,
            day: selectedAnnotationForEdit.day,
            month: selectedAnnotationForEdit.month,
            year: selectedAnnotationForEdit.year,
            column: 0, // Default values, will be calculated by layout
            totalColumns: 1,
            completed: false
        };
        tasks.push(newTask);
    }
    selectedAnnotationForEdit = null;
    render();
    
    // Force switch to Agenda to show the task
    activeTab = 'Agenda';
    currentPage = 'agenda';
    render();
}

function handleCloseAnnotationModal() {
    selectedAnnotationForEdit = null;
    render();
}

function handleNoteSelect(noteId: number) {
    selectedNote = notes.find(n => n.id === noteId) || null;
    currentPage = 'noteDetail';
    newAnnotationText = '';
    render();
}

function handleDoneClick() {
    if (currentPage === 'noteDetail' && selectedNote && newAnnotationText.trim()) {
        playSound('pop');
        const newAnnotation: Annotation = {
            id: Date.now(),
            text: newAnnotationText.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        selectedNote.annotations.unshift(newAnnotation);
        const noteIndex = notes.findIndex(n => n.id === selectedNote!.id);
        if (noteIndex !== -1) {
            notes[noteIndex] = selectedNote;
        }
        newAnnotationText = '';
        render();
        const annotationsList = document.getElementById('annotations-list');
        if (annotationsList) {
            annotationsList.scrollTop = 0;
        }
    }
}

function setupFooterListeners() {
    footerEl.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const button = target.closest('.footer-tab');
        if (button) {
            playSound('click');
            const tab = button.getAttribute('data-tab');
            if (tab && tab !== activeTab) {
                activeTab = tab as 'Perfil' | 'Agenda' | 'Loja';
                if (tab === 'Perfil') {
                    currentPage = 'perfil';
                } else if (tab === 'Agenda') {
                    currentPage = 'agenda';
                } else if (tab === 'Loja') {
                    currentPage = 'loja';
                }
                selectedNote = null;
                render();
            }
        }
    });
}

function setupDraggableScrollListeners() {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    let isDown = false;
    let startX: number, startY: number;
    let scrollLeft: number, scrollTop: number;
    let activeSlider: HTMLElement | null = null;
    let isVertical = false;

    const stopDragging = () => {
        if (!isDown) return;
        isDown = false;
        if (activeSlider) {
            activeSlider.classList.remove('cursor-grabbing');
            activeSlider.classList.add('cursor-grab');
        }
        activeSlider = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', stopDragging);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDown || !activeSlider) return;
        e.preventDefault();
        
        if (isVertical) {
            const walk = e.pageY - startY;
            activeSlider.scrollTop = scrollTop - walk;
        } else {
            const walk = e.pageX - startX;
            activeSlider.scrollLeft = scrollLeft - walk;
        }
    };
    
    mainEl.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).closest('button, a, input, textarea')) {
            return;
        }

        const slider = (e.target as HTMLElement).closest('.draggable-scroll-horizontal, .draggable-scroll-vertical') as HTMLElement | null;
        if (!slider) return;
        
        isDown = true;
        activeSlider = slider;
        isVertical = slider.classList.contains('draggable-scroll-vertical');

        slider.classList.add('cursor-grabbing');
        slider.classList.remove('cursor-grab');
        
        if (isVertical) {
            startY = e.pageY;
            scrollTop = slider.scrollTop;
        } else {
            startX = e.pageX;
            scrollLeft = slider.scrollLeft;
        }
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', stopDragging);
    });
}

// FAB LISTENER with EXPAND ANIMATION - FIXED
fab.addEventListener('click', () => {
    if (activeTab !== 'Agenda') return;

    playSound('click');

    // Navigation Logic
    if (currentPage === 'noteDetail') {
        currentPage = 'notes';
        selectedNote = null;
        newAnnotationText = '';
        render();
        return;
    } 

    // Agenda -> Notes (OPEN)
    if (currentPage === 'agenda') {
        currentPage = 'notes';
        
        // 1. Render normally (which adds display:block)
        render();
        
        // 2. Force Reflow so the browser acknowledges the element is there before animating
        void notesViewEl.offsetWidth; 
        
        // 3. Apply Animation
        notesViewEl.classList.add('view-expand-enter');
        notesViewEl.addEventListener('animationend', () => {
            notesViewEl.classList.remove('view-expand-enter');
        }, { once: true });
    } 
    // Notes -> Agenda (CLOSE)
    else if (currentPage === 'notes') {
        // Apply exit animation first
        notesViewEl.classList.add('view-collapse-exit');
        
        // Wait for animation to almost finish before switching state
        setTimeout(() => {
            notesViewEl.classList.remove('view-collapse-exit');
            currentPage = 'agenda';
            render();
        }, 280); 
    }
});

// --- MAIN RENDER LOGIC ---
function render() {
    // Standard Render
    Object.values(views).forEach(view => view.classList.add('hidden'));

    renderHeader();
    renderFooter();
    
    if (activeTab === 'Agenda') {
        fab.classList.remove('hidden');
        if (currentPage === 'noteDetail') {
            fab.style.bottom = '142px';
        } else {
            fab.style.bottom = '70px';
        }
    } else {
        fab.classList.add('hidden');
    }

    if (views[currentPage as keyof typeof views]) {
        views[currentPage as keyof typeof views].classList.remove('hidden');
    }

    switch (currentPage) {
        case 'perfil':
            renderPerfilView();
            break;
        case 'settings':
            renderSettingsView();
            break;
        case 'agenda':
            renderAgendaView();
            break;
        case 'notes':
            renderNotesView();
            break;
        case 'noteDetail':
            renderNoteDetailView();
            break;
        case 'loja':
            renderLojaView();
            break;
    }
    
    renderAnnotationDetailModal();
    renderCalendarModal();
    renderTaskDetailModal();
}

// Placeholder logo (use a small colored box or valid base64 if available)
// Using a simple inline SVG data URI as a safe fallback to prevent syntax errors from truncated base64
const LOGO_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2ZjNzUxIiAvPjwvc3ZnPg==';

// --- INITIALIZATION ---
function initializeApp() {
    render();
    setupFooterListeners();
    setupDraggableScrollListeners();
}

//--- LOGIN LOGIC ---
const loginViewEl = document.getElementById('login-view')!;
const loginBtn = document.getElementById('login-btn')!;

function renderLoginView() {
    // Inject Social Buttons
    const socialLoginPlaceholder = document.getElementById('social-login-placeholder')!;
    socialLoginPlaceholder.innerHTML = `
        <button class="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            ${GoogleIcon} <span class="ml-3">Continuar com Google</span>
        </button>
        <button class="w-full bg-black text-white font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
            ${AppleIcon} <span class="ml-3">Continuar com Apple</span>
        </button>
    `;

    // Inject Main Icon
    const loginIconPlaceholder = document.getElementById('login-icon-placeholder')!;
    loginIconPlaceholder.innerHTML = `<img src="${LOGO_BASE64}" alt="App Logo" class="w-32 h-auto object-contain"/>`;
}

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginViewEl.classList.add('hidden');
    appContainerEl.classList.remove('hidden');
    initializeApp();
});

// Initial render of the login view
renderLoginView();
