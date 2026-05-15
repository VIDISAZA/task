'use client';
import { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import styles from './page.module.css';
import { useTaskStore } from '@/store/useTaskStore';
import { Plus, Check, Trash2, Calendar, Star, CheckCircle2 } from 'lucide-react';

const EmptyState = ({ message, subMessage }) => (
  <div className={styles.emptyState}>
    <CheckCircle2 size={32} style={{ color: 'var(--primary)', opacity: 0.5 }} />
    <div>
      <h4 style={{ margin: 0, fontWeight: 500 }}>{message}</h4>
      <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.5 }}>{subMessage}</p>
    </div>
  </div>
);

const TaskItem = ({ task, onUpdate, onDelete }) => (
  <div className={styles.taskItem}>
    <div className={styles.taskContent}>
      <div 
        className={`${styles.checkbox} ${task.status === 'completed' ? styles.completed : ''}`}
        onClick={() => onUpdate(task._id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
      >
        {task.status === 'completed' && <Check size={14} />}
      </div>
      <div>
        <div className={`${styles.taskTitle} ${task.status === 'completed' ? styles.completed : ''}`}>
          {task.title}
          {task.aiPriorityScore > 80 && <Star size={14} color="var(--warning)" style={{ marginLeft: '4px', display: 'inline' }} />}
        </div>
        <div className={styles.taskMeta}>
          <span className={styles.categoryTag}>{task.category}</span>
          {task.dueDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
    <button onClick={() => onDelete(task._id)} style={{ color: 'var(--danger)', opacity: 0.5 }}>
      <Trash2 size={16} />
    </button>
  </div>
);

export default function TasksPage() {
  const [view, setView] = useState('matrix'); // 'matrix' or 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, fetchTasks, addTask, updateTask, deleteTask } = useTaskStore();

  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Work',
    priority: 'medium',
    urgency: 'low',
    dueDate: '',
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getTasksByQuadrant = (priority, urgency) => {
    return (tasks || []).filter(
      (t) => t.priority === priority && t.urgency === urgency && t.status !== 'completed'
    );
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    // Clean data before sending
    const taskData = {
      ...newTask,
      dueDate: newTask.dueDate || null
    };

    // Close modal immediately for better perceived performance
    setIsModalOpen(false);
    setNewTask({ title: '', category: 'Work', priority: 'medium', urgency: 'low', dueDate: '' });

    // Send to backend (or fallback to local if backend hangs/fails)
    await addTask(taskData);
  };

  return (
    <div>
      <Topbar title="Tasks & Matrix" />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${view === 'matrix' ? styles.active : ''}`}
              onClick={() => setView('matrix')}
            >
              Eisenhower Matrix
            </button>
            <button 
              className={`${styles.tab} ${view === 'list' ? styles.active : ''}`}
              onClick={() => setView('list')}
            >
              All Tasks
            </button>
          </div>
          
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Task
          </button>
        </div>

        {view === 'matrix' ? (
          <div className={styles.eisenhowerGrid}>
            <div className={`${styles.quadrant} ${styles.doFirst}`}>
              <div className={styles.quadrantHeader}>
                <span className={styles.quadrantTitle}>Do First (Urgent & Important)</span>
                <span className="badge">{getTasksByQuadrant('high', 'high').length}</span>
              </div>
              <div className={styles.taskList}>
                {getTasksByQuadrant('high', 'high').length > 0 
                  ? getTasksByQuadrant('high', 'high').map(t => <TaskItem key={t._id} task={t} onUpdate={updateTask} onDelete={deleteTask} />)
                  : <EmptyState message="All clear!" subMessage="No urgent tasks to do first." />}
              </div>
            </div>
            
            <div className={`${styles.quadrant} ${styles.schedule}`}>
              <div className={styles.quadrantHeader}>
                <span className={styles.quadrantTitle}>Schedule (Important, Not Urgent)</span>
                <span className="badge">{getTasksByQuadrant('high', 'low').length}</span>
              </div>
              <div className={styles.taskList}>
                {getTasksByQuadrant('high', 'low').length > 0
                  ? getTasksByQuadrant('high', 'low').map(t => <TaskItem key={t._id} task={t} onUpdate={updateTask} onDelete={deleteTask} />)
                  : <EmptyState message="Nothing scheduled." subMessage="You have time to plan ahead." />}
              </div>
            </div>
 
            <div className={`${styles.quadrant} ${styles.delegate}`}>
              <div className={styles.quadrantHeader}>
                <span className={styles.quadrantTitle}>Delegate (Urgent, Not Important)</span>
                <span className="badge">{getTasksByQuadrant('low', 'high').length + getTasksByQuadrant('medium', 'high').length}</span>
              </div>
              <div className={styles.taskList}>
                {[...getTasksByQuadrant('medium', 'high'), ...getTasksByQuadrant('low', 'high')].length > 0
                  ? [...getTasksByQuadrant('medium', 'high'), ...getTasksByQuadrant('low', 'high')].map(t => <TaskItem key={t._id} task={t} onUpdate={updateTask} onDelete={deleteTask} />)
                  : <EmptyState message="No delegations." subMessage="Everything is under your control." />}
              </div>
            </div>
 
            <div className={`${styles.quadrant} ${styles.eliminate}`}>
              <div className={styles.quadrantHeader}>
                <span className={styles.quadrantTitle}>Don't Do (Not Urgent, Not Important)</span>
                <span className="badge">{getTasksByQuadrant('low', 'low').length + getTasksByQuadrant('medium', 'low').length}</span>
              </div>
              <div className={styles.taskList}>
                {[...getTasksByQuadrant('medium', 'low'), ...getTasksByQuadrant('low', 'low')].length > 0
                  ? [...getTasksByQuadrant('medium', 'low'), ...getTasksByQuadrant('low', 'low')].map(t => <TaskItem key={t._id} task={t} onUpdate={updateTask} onDelete={deleteTask} />)
                  : <EmptyState message="Matrix is clean." subMessage="No distractions found." />}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3>All Pending Tasks</h3>
            <div className={styles.taskList} style={{ marginTop: '1rem', maxHeight: 'none' }}>
              {tasks.filter(t => t.status !== 'completed').length > 0
                ? tasks.filter(t => t.status !== 'completed').map(t => <TaskItem key={t._id} task={t} onUpdate={updateTask} onDelete={deleteTask} />)
                : <EmptyState message="No pending tasks!" subMessage="You're all caught up." />}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
            <form onSubmit={handleAddTask}>
              <div className={styles.formGroup}>
                <label>Task Title</label>
                <input 
                  type="text" 
                  className={styles.formControl} 
                  required 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  placeholder="E.g., Prepare Q3 presentation"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>Importance (Priority)</label>
                  <select 
                    className={styles.formControl}
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="high">High (Important)</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low (Not Important)</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Urgency</label>
                  <select 
                    className={styles.formControl}
                    value={newTask.urgency}
                    onChange={e => setNewTask({...newTask, urgency: e.target.value})}
                  >
                    <option value="high">High (Urgent)</option>
                    <option value="low">Low (Not Urgent)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <input 
                    type="text" 
                    className={styles.formControl} 
                    value={newTask.category}
                    onChange={e => setNewTask({...newTask, category: e.target.value})}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Due Date</label>
                  <input 
                    type="date" 
                    className={styles.formControl} 
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
