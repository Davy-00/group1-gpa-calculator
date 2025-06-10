// GPA Calculator - Core JavaScript Logic (Modified for Memory-First Storage)
class GPACalculator {
    constructor() {
        this.entries = []; // Current session entries (temporary)
        this.savedEntries = []; // Entries saved to localStorage
        this.hasUnsavedChanges = false; // Track if there are unsaved changes
        this.init();
    }

    // Initialize the application
    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.render();
        console.log('🎓 GPA Calculator initialized!');
        console.log('Press "S" key to log all assignment data to console');
    }

    // Bind all event listeners
    bindEvents() {
        // Form submission
        const form = document.getElementById('assignment-form');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Storage control buttons
        const saveBtn = document.getElementById('save-btn');
        const clearAllBtn = document.getElementById('clear-all-btn');
        
        saveBtn.addEventListener('click', () => this.manualSave());
        clearAllBtn.addEventListener('click', () => this.clearAllData());

        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Input validation in real-time
        const gradeInput = document.getElementById('assignment-grade');
        gradeInput.addEventListener('input', (e) => this.validateGradeInput(e));
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('assignment-name');
        const gradeInput = document.getElementById('assignment-grade');
        
        const name = nameInput.value.trim();
        const grade = parseFloat(gradeInput.value);

        // Validation
        if (!this.validateInput(name, grade)) {
            return;
        }

        // Show loading animation
        this.showLoading();

        // Simulate processing time for better UX
        setTimeout(() => {
            this.addAssignment(name, grade);
            this.showSuccessMessage();
            this.hideLoading();
            
            // Clear form
            nameInput.value = '';
            gradeInput.value = '';
            nameInput.focus();
        }, 500);
    }

    // Validate input data
    validateInput(name, grade) {
        if (!name) {
            alert('Please enter an assignment name.');
            return false;
        }

        if (isNaN(grade) || grade < 0 || grade > 5) {
            alert('Please enter a valid grade between 0 and 5.');
            return false;
        }

        return true;
    }

    // Real-time grade input validation
    validateGradeInput(e) {
        const value = parseFloat(e.target.value);
        const input = e.target;

        if (value > 5) {
            input.value = 5;
        } else if (value < 0) {
            input.value = 0;
        }
    }

    // Add new assignment (to memory only, not localStorage)
    addAssignment(name, grade) {
        const assignment = {
            id: Date.now(), // Simple ID generation
            name: name,
            grade: grade,
            dateAdded: new Date().toLocaleDateString(),
            isTemporary: true // Flag to indicate it's not saved to localStorage yet
        };

        this.entries.push(assignment);
        this.hasUnsavedChanges = true;
        this.render();

        console.log(`✅ Added to memory: ${name} - Grade: ${grade} (Not saved to localStorage yet)`);
    }

    // Manual save function triggered by save button - saves ALL current entries to localStorage
    manualSave() {
        this.showLoading();
        
        setTimeout(() => {
            // Mark all temporary entries as saved
            this.entries.forEach(entry => {
                entry.isTemporary = false;
            });
            
            // Update saved entries to match current entries
            this.savedEntries = [...this.entries];
            
            // Save to localStorage
            this.saveToStorage();
            this.hasUnsavedChanges = false;
            
            this.updateStorageStatus('💾 All assignments saved to localStorage!', 'success');
            this.hideLoading();
            this.render(); // Re-render to update visual indicators
            
            console.log(`💾 Saved ${this.entries.length} assignments to localStorage`);
            
            // Reset status after 3 seconds
            setTimeout(() => {
                this.updateStorageStatus(this.getStorageStatusText(), 'normal');
            }, 3000);
        }, 500);
    }

    // Delete individual assignment (from memory)
    deleteAssignment(id) {
        const assignment = this.entries.find(entry => entry.id === id);
        if (!assignment) return;

        if (confirm(`Are you sure you want to delete "${assignment.name}"?`)) {
            this.entries = this.entries.filter(entry => entry.id !== id);
            
            // Check if this was a saved assignment
            const wasSaved = this.savedEntries.some(entry => entry.id === id);
            if (wasSaved) {
                this.hasUnsavedChanges = true;
            }
            
            this.render();
            this.updateStorageStatus('🗑️ Assignment deleted from memory', 'warning');
            
            console.log(`🗑️ Deleted from memory: ${assignment.name}`);
            
            // Reset status after 2 seconds
            setTimeout(() => {
                this.updateStorageStatus(this.getStorageStatusText(), 'normal');
            }, 2000);
        }
    }

    // Get appropriate storage status text
    getStorageStatusText() {
        const unsavedCount = this.entries.filter(entry => entry.isTemporary).length;
        if (unsavedCount > 0) {
            return `⚠️ ${unsavedCount} unsaved assignment${unsavedCount > 1 ? 's' : ''}`;
        } else if (this.hasUnsavedChanges) {
            return '⚠️ Unsaved changes detected';
        } else {
            return '✅ All data saved';
        }
    }

    // Update storage status display
    updateStorageStatus(message, type = 'normal') {
        const statusElement = document.getElementById('storage-status');
        statusElement.textContent = message;
        
        // Remove existing status classes
        statusElement.classList.remove('status-success', 'status-warning', 'status-error');
        
        // Add appropriate class
        if (type === 'success') {
            statusElement.classList.add('status-success');
        } else if (type === 'warning') {
            statusElement.classList.add('status-warning');
        } else if (type === 'error') {
            statusElement.classList.add('status-error');
        }
    }

    calculateGPA() {
        if (this.entries.length === 0) {
            return 0;
        }

        const totalGrades = this.entries.reduce((sum, entry) => sum + entry.grade, 0);
        return (totalGrades / this.entries.length);
    }

    // Render all UI components
    render() {
        this.renderGPA();
        this.renderAssignments();
        this.renderTotalCount();
        this.updateStorageStatus(this.getStorageStatusText());
    }

    // Render GPA display
    renderGPA() {
        const gpaDisplay = document.getElementById('gpa-display');
        const gpa = this.calculateGPA();
        gpaDisplay.textContent = gpa.toFixed(2);

        // Add color coding based on GPA
        const gpaContainer = gpaDisplay.parentElement;
        gpaContainer.className = 'gpa-display';
        
        if (gpa >= 4.5) {
            gpaContainer.classList.add('excellent');
        } else if (gpa >= 3.5) {
            gpaContainer.classList.add('good');
        } else if (gpa >= 2.5) {
            gpaContainer.classList.add('average');
        } else if (gpa > 0) {
            gpaContainer.classList.add('needs-improvement');
        }
    }

    // Render assignments list
    renderAssignments() {
        const container = document.getElementById('assignments-list');
        
        if (this.entries.length === 0) {
            container.innerHTML = '<p class="no-assignments">No assignments added yet. Start by adding your first assignment!</p>';
            return;
        }

        // Sort entries by date (newest first)
        const sortedEntries = [...this.entries].sort((a, b) => b.id - a.id);

        const assignmentsHTML = sortedEntries.map(entry => {
            const statusIndicator = entry.isTemporary ? 
                '<span class="temp-indicator" title="Not saved to localStorage yet">📝</span>' : 
                '<span class="saved-indicator" title="Saved to localStorage">💾</span>';
            
            return `
                <div class="assignment-item ${entry.isTemporary ? 'temporary' : 'saved'}" data-id="${entry.id}">
                    <div class="assignment-info">
                        <h3>${this.escapeHtml(entry.name)} ${statusIndicator}</h3>
                        <span>Added: ${entry.dateAdded}</span>
                    </div>
                    <div class="assignment-actions">
                        <div class="assignment-grade">${entry.grade.toFixed(1)}</div>
                        <button class="btn-delete" onclick="window.gpaCalculator.deleteAssignment(${entry.id})" title="Delete assignment">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = assignmentsHTML;
    }

    // Render total count
    renderTotalCount() {
        const totalCount = document.getElementById('total-count');
        const unsavedCount = this.entries.filter(entry => entry.isTemporary).length;
        const savedCount = this.entries.length - unsavedCount;
        
        totalCount.innerHTML = `${this.entries.length} <small>(${savedCount} saved, ${unsavedCount} unsaved)</small>`;
    }

    // Handle keyboard events
    handleKeyPress(e) {
        // Press 'S' to log data to console
        if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.altKey) {
            this.logDataToConsole();
        }
    }

    // Log all data to console (requirement #4)
    logDataToConsole() {
        console.clear();
        console.log('📊 GPA CALCULATOR DATA EXPORT');
        console.log('================================');
        console.log(`Current GPA: ${this.calculateGPA().toFixed(2)}`);
        console.log(`Total Assignments: ${this.entries.length}`);
        
        const unsavedCount = this.entries.filter(entry => entry.isTemporary).length;
        const savedCount = this.entries.length - unsavedCount;
        console.log(`Saved to localStorage: ${savedCount}`);
        console.log(`Unsaved (memory only): ${unsavedCount}`);
        console.log('');
        
        if (this.entries.length > 0) {
            console.log('📝 ASSIGNMENT DETAILS:');
            console.table(this.entries.map(entry => ({
                'Assignment Name': entry.name,
                'Grade': entry.grade,
                'Date Added': entry.dateAdded,
                'Status': entry.isTemporary ? 'Unsaved' : 'Saved'
            })));
            
            console.log('');
            console.log('📈 STATISTICS:');
            const stats = this.calculateStatistics();
            console.log(`Highest Grade: ${stats.highest}`);
            console.log(`Lowest Grade: ${stats.lowest}`);
            console.log(`Average Grade: ${stats.average.toFixed(2)}`);
            console.log(`Grade Distribution:`, stats.distribution);
        } else {
            console.log('No assignments have been added yet.');
        }
        
        console.log('');
        console.log('💾 Current Session Data (JSON):');
        console.log(JSON.stringify(this.entries, null, 2));
        
        if (this.savedEntries.length > 0) {
            console.log('');
            console.log('🗄️ Saved Data in localStorage (JSON):');
            console.log(JSON.stringify(this.savedEntries, null, 2));
        }
    }

    // Calculate additional statistics
    calculateStatistics() {
        if (this.entries.length === 0) {
            return {
                highest: 0,
                lowest: 0,
                average: 0,
                distribution: {}
            };
        }

        const grades = this.entries.map(entry => entry.grade);
        const distribution = {};
        
        grades.forEach(grade => {
            const rounded = Math.floor(grade);
            distribution[`${rounded}-${rounded + 1}`] = (distribution[`${rounded}-${rounded + 1}`] || 0) + 1;
        });

        return {
            highest: Math.max(...grades),
            lowest: Math.min(...grades),
            average: grades.reduce((sum, grade) => sum + grade, 0) / grades.length,
            distribution: distribution
        };
    }

    // Save data to localStorage (only saves the savedEntries array)
    saveToStorage() {
        try {
            const dataToSave = {
                entries: this.savedEntries,
                lastUpdated: new Date().toISOString()
            };
            
            // Check if localStorage is available (for real browser environments)
            if (typeof(Storage) !== "undefined" && localStorage) {
                localStorage.setItem('gpaCalculatorData', JSON.stringify(dataToSave));
                console.log('💾 Data saved to localStorage successfully');
                return true;
            } else {
                // Fallback for environments without localStorage (like Claude.ai)
                this.localStorageData = dataToSave;
                console.log('💾 Data saved to memory (localStorage not available)');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ Could not save data:', error);
            this.updateStorageStatus('❌ Save failed', 'error');
            // Fallback to memory storage
            this.localStorageData = {
                entries: this.savedEntries,
                lastUpdated: new Date().toISOString()
            };
            return false;
        }
    }

    // Load data from localStorage (only loads into savedEntries, then copies to current entries)
    loadFromStorage() {
        try {
            let loadedData = null;
            
            // Try to load from localStorage first
            if (typeof(Storage) !== "undefined" && localStorage) {
                const savedData = localStorage.getItem('gpaCalculatorData');
                if (savedData) {
                    loadedData = JSON.parse(savedData);
                }
            }
            
            // Fallback to memory storage (for Claude.ai environment)
            if (!loadedData && this.localStorageData && this.localStorageData.entries) {
                loadedData = this.localStorageData;
            }
            
            if (loadedData && loadedData.entries) {
                // Load saved entries and mark them as saved
                this.savedEntries = loadedData.entries.map(entry => ({
                    ...entry,
                    isTemporary: false
                }));
                this.entries = [...this.savedEntries]; // Copy saved entries to current entries
                this.hasUnsavedChanges = false;
                console.log(`📂 Loaded ${this.entries.length} assignments from localStorage`);
            } else {
                this.savedEntries = [];
                this.entries = [];
                this.hasUnsavedChanges = false;
            }
        } catch (error) {
            console.warn('⚠️ Could not load data from storage:', error);
            this.savedEntries = [];
            this.entries = [];
            this.hasUnsavedChanges = false;
        }
    }

    // Utility function to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show loading animation
    showLoading() {
        const loading = document.getElementById('loading');
        loading.classList.remove('hidden');
    }

    // Hide loading animation
    hideLoading() {
        const loading = document.getElementById('loading');
        loading.classList.add('hidden');
    }

    // Show success message
    showSuccessMessage() {
        const message = document.getElementById('success-message');
        message.classList.remove('hidden');
        
        setTimeout(() => {
            message.classList.add('hidden');
        }, 3000);
    }

    // Public method to get all entries (for external access)
    getAllEntries() {
        return [...this.entries];
    }

    // Public method to clear all data
    clearAllData() {
        if (confirm('Are you sure you want to clear all assignments? This will clear both memory and saved data and cannot be undone.')) {
            this.entries = [];
            this.savedEntries = [];
            this.hasUnsavedChanges = false;
            
            // Clear from localStorage
            try {
                if (typeof(Storage) !== "undefined" && localStorage) {
                    localStorage.removeItem('gpaCalculatorData');
                    console.log('🗑️ Data cleared from localStorage');
                }
            } catch (error) {
                console.warn('⚠️ Could not clear localStorage:', error);
            }
            
            // Clear from memory fallback
            this.localStorageData = null;
            
            this.render();
            console.log('🗑️ All data cleared from memory and localStorage');
        }
    }

    // Public method to export data as JSON
    exportData() {
        const dataStr = JSON.stringify({
            gpa: this.calculateGPA(),
            totalAssignments: this.entries.length,
            assignments: this.entries,
            savedAssignments: this.savedEntries,
            hasUnsavedChanges: this.hasUnsavedChanges,
            exportDate: new Date().toISOString()
        }, null, 2);
        
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gpa-calculator-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        console.log('📤 Data exported successfully');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.gpaCalculator = new GPACalculator();
});

// Additional utility functions for console interaction
window.gpaUtils = {
    // Quick function to add assignment via console (to memory only)
    addQuick: (name, grade) => {
        if (window.gpaCalculator) {
            window.gpaCalculator.addAssignment(name, grade);
        }
    },
    
    // Quick function to view current GPA
    getGPA: () => {
        if (window.gpaCalculator) {
            return window.gpaCalculator.calculateGPA();
        }
    },
    
    // Quick function to save all current data to localStorage
    save: () => {
        if (window.gpaCalculator) {
            window.gpaCalculator.manualSave();
        }
    },
    
    // Quick function to export data
    export: () => {
        if (window.gpaCalculator) {
            window.gpaCalculator.exportData();
        }
    },
    
    // Quick function to clear all data
    clear: () => {
        if (window.gpaCalculator) {
            window.gpaCalculator.clearAllData();
        }
    }
};

// Console welcome message
console.log(`
🎓 GPA Calculator Loaded Successfully! (Memory-First Mode)
=========================================================

How it works:
• Add Assignment: Saves to memory only (temporary)
• Save Data: Saves all current assignments to localStorage
• Delete: Removes from memory (doesn't auto-save)

Quick Commands:
• Press 'S' key anywhere to log all data
• gpaUtils.addQuick('Assignment Name', 4.5) - Add to memory
• gpaUtils.save() - Save all to localStorage
• gpaUtils.getGPA() - Get current GPA
• gpaUtils.export() - Export data as JSON
• gpaUtils.clear() - Clear all data

Visual Indicators:
📝 = Unsaved (memory only)
💾 = Saved to localStorage

Ready to track your academic progress! 📚
`);