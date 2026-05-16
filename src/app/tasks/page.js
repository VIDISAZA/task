'use client';
import { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import styles from './page.module.css';
import { useTaskStore } from '@/store/useTaskStore';
import { Plus, Check, Trash2, Calendar, Star, CheckCircle2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, subMonths, addMonths } from 'date-fns';

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
  const [view, setView] = useState('calendar'); // 'calendar', 'matrix' or 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
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

  const openTaskModalForDate = (date) => {
    setNewTask({ ...newTask, dueDate: format(date, 'yyyy-MM-dd') });
    setIsModalOpen(true);
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        // Find tasks for this day
        const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), cloneDay));

        days.push(
          <div
            className={`${styles.dayCell} ${!isSameMonth(day, monthStart) ? styles.otherMonth : ''} ${isSameDay(day, new Date()) ? styles.today : ''}`}
            key={day.toString()}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className={styles.dayNumber}>{formattedDate}</span>
            {dayTasks.slice(0, 3).map(t => (
              <div key={t._id} className={`${styles.taskPill} ${t.status === 'completed' ? styles.completed : styles[t.priority]}`}>
                {t.title}
              </div>
            ))}
            {dayTasks.length > 3 && <div className={styles.taskPill} style={{background: 'transparent', color: 'var(--primary)'}}>+{dayTasks.length - 3} more</div>}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className={styles.calendarGrid} key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <button className={styles.calendarNavBtn} onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft size={20} /></button>
          <h2>{format(currentMonth, "MMMM yyyy")}</h2>
          <button className={styles.calendarNavBtn} onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight size={20} /></button>
        </div>
        <div className={styles.calendarGrid} style={{ marginBottom: '1rem' }}>
          {weekDays.map(wd => <div key={wd} className={styles.weekdayHeader}>{wd}</div>)}
        </div>
        <div>{rows}</div>
      </div>
    );
  };

  return (
    <div>
      <Topbar title="Tasks & Matrix" />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${view === 'calendar' ? styles.active : ''}`}
              onClick={() => setView('calendar')}
            >
              Calendar
            </button>
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
        ) : view === 'calendar' ? (
          renderCalendar()
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

      {selectedDate && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDate(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Schedule for {format(selectedDate, "MMM d, yyyy")}</h2>
              <button onClick={() => setSelectedDate(null)} style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div className={styles.taskList} style={{ maxHeight: '300px', marginBottom: '1.5rem' }}>
              {tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate)).length > 0 ? (
                tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate)).map(t => (
                  <TaskItem key={t._id} task={t} onUpdate={updateTask} onDelete={deleteTask} />
                ))
              ) : (
                <EmptyState message="Free day!" subMessage="No tasks scheduled for this date." />
              )}
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} 
              onClick={() => {
                setSelectedDate(null);
                openTaskModalForDate(selectedDate);
              }}
            >
              <Plus size={18} /> Add Task on this day
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
