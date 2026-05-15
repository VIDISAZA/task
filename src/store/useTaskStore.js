import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      error: null,
  
      fetchTasks: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/tasks');
          const data = await res.json();
          if (data.success) {
            // MERGE LOGIC: Jangan hapus task offline (ID berawalan 'local_') jika berhasil fetch
            set((state) => {
              const dbTasks = data.data || [];
              const localOnlyTasks = state.tasks.filter(t => t._id && t._id.toString().startsWith('local_'));
              
              // Gabungkan task lokal dan task dari database
              return { 
                tasks: [...localOnlyTasks, ...dbTasks], 
                isLoading: false, 
                error: null 
              };
            });
          } else {
            console.error('API Error:', data.error);
            set({ isLoading: false }); // keep offline tasks
          }
        } catch (err) {
          console.error('Network/DB Error - Using Offline Mode', err.message);
          set({ isLoading: false }); // keep offline tasks
        }
      },

      addTask: async (taskData) => {
        // Optimistic Update: Add to UI instantly
        const pseudoId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const optimisticTask = {
          ...taskData,
          _id: pseudoId,
          status: 'pending',
          createdAt: new Date().toISOString(),
          aiPriorityScore: 50 // default
        };
        
        set((state) => ({ tasks: [optimisticTask, ...state.tasks] }));

        try {
          const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
          });
          const data = await res.json();
          if (data.success) {
            // Replace optimistic task with the real one from DB
            set((state) => ({
              tasks: state.tasks.map(t => t._id === pseudoId ? data.data : t)
            }));
            return { success: true };
          } else {
             throw new Error(data.error);
          }
        } catch (err) {
          console.warn('Backend failed, keeping task LOCALLY:', err.message);
          return { success: true, offline: true };
        }
      },

      updateTask: async (id, updates) => {
        try {
          const res = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });
          const data = await res.json();
          if (data.success) {
            set((state) => ({
              tasks: state.tasks.map((t) => (t._id === id ? data.data : t)),
            }));
          } else {
             throw new Error(data.error);
          }
        } catch (err) {
          console.warn('Backend failed, updating task LOCALLY:', err.message);
          // Fallback
          set((state) => ({
            tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...updates } : t)),
          }));
        }
      },

      deleteTask: async (id) => {
        try {
          const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.success) {
            set((state) => ({
              tasks: state.tasks.filter((t) => t._id !== id),
            }));
          } else {
             throw new Error(data.error);
          }
        } catch (err) {
          console.warn('Backend failed, deleting task LOCALLY:', err.message);
          // Fallback
          set((state) => ({
            tasks: state.tasks.filter((t) => t._id !== id),
          }));
        }
      },
    }),
    {
      name: 'arion-task-storage', // name of the item in the storage (must be unique)
    }
  )
);
