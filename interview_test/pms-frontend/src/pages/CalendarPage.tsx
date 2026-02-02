import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  Wrench,
  Home,
  Users,
  FileText,
  Phone,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/ui';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'inspection' | 'maintenance' | 'meeting' | 'showing' | 'appointment' | 'deadline';
  propertyId?: string;
  propertyName?: string;
  attendees: string[];
  location?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  notes?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  event?: CalendarEvent;
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'inspection' | 'maintenance' | 'meeting' | 'showing'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'inspection' as CalendarEvent['type'],
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    propertyId: '',
    priority: 'medium' as CalendarEvent['priority'],
    location: '',
    attendees: '',
    notes: '',
  });

  const getDateStr = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Property Inspection',
      description: 'Monthly routine inspection for Hillpointe Manor #12A',
      date: getDateStr(0),
      startTime: '10:00',
      endTime: '11:00',
      type: 'inspection',
      propertyId: 'prop-1',
      propertyName: 'Hillpointe Manor #12A',
      attendees: ['John Doe', 'Sarah Johnson'],
      location: '123 Hillpointe Drive, Unit 12A',
      status: 'scheduled',
      priority: 'medium',
      createdBy: 'Manager',
      notes: 'Check HVAC system and plumbing'
    },
    {
      id: '2',
      title: 'Maintenance Visit',
      description: 'Fix heating system noise in unit 12A',
      date: getDateStr(0),
      startTime: '14:00',
      endTime: '16:00',
      type: 'maintenance',
      propertyId: 'prop-1',
      propertyName: 'Hillpointe Manor #12A',
      attendees: ['Mike Thompson', 'Sarah Johnson'],
      location: '123 Hillpointe Drive, Unit 12A',
      status: 'confirmed',
      priority: 'high',
      createdBy: 'Manager',
      notes: 'Urgent repair needed'
    },
    {
      id: '3',
      title: 'Owner Meeting',
      description: 'Q4 financial review with property owner',
      date: getDateStr(1),
      startTime: '09:00',
      endTime: '10:30',
      type: 'meeting',
      attendees: ['Robert Chen', 'Manager'],
      location: 'Office Conference Room',
      status: 'scheduled',
      priority: 'medium',
      createdBy: 'Manager'
    },
    {
      id: '4',
      title: 'Property Showing',
      description: 'Show apartment to potential tenant',
      date: getDateStr(2),
      startTime: '15:00',
      endTime: '16:00',
      type: 'showing',
      propertyId: 'prop-2',
      propertyName: 'Garden View Apartments #3B',
      attendees: ['Manager', 'Prospective Tenant'],
      location: '456 Garden View Street, Unit 3B',
      status: 'scheduled',
      priority: 'medium',
      createdBy: 'Manager'
    },
    {
      id: '5',
      title: 'Lease Signing',
      description: 'New tenant lease signing appointment',
      date: getDateStr(3),
      startTime: '11:00',
      endTime: '12:00',
      type: 'appointment',
      propertyId: 'prop-3',
      propertyName: 'Sunset Plaza #7A',
      attendees: ['Manager', 'New Tenant'],
      location: 'Office',
      status: 'confirmed',
      priority: 'high',
      createdBy: 'Manager'
    }
  ];

  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event =>
      event.date === dateString &&
      (eventFilter === 'all' || event.type === eventFilter) &&
      (searchTerm === '' ||
       event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       event.propertyName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      const days = direction === 'prev' ? -7 : 7;
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      const days = direction === 'prev' ? -1 : 1;
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time,
          available: true
        });
      }
    }
    return slots;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes} ${period}`;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'inspection': return '#2563eb';
      case 'maintenance': return '#dc2626';
      case 'meeting': return '#2d5a41';
      case 'showing': return '#7c3aed';
      case 'appointment': return '#059669';
      case 'deadline': return '#ea580c';
      default: return '#6b7280';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'inspection': return <Home size={14} />;
      case 'maintenance': return <Wrench size={14} />;
      case 'meeting': return <Users size={14} />;
      case 'showing': return <MapPin size={14} />;
      case 'appointment': return <User size={14} />;
      case 'deadline': return <FileText size={14} />;
      default: return <Calendar size={14} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#2563eb';
      case 'confirmed': return '#059669';
      case 'completed': return '#16a34a';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  };
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'confirmed': return 'success';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const propertyNameMap: Record<string, string> = {
    'prop-1': 'Hillpointe Manor #12A',
    'prop-2': 'Garden View Apartments #3B',
    'prop-3': 'Sunset Plaza #7A',
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.startTime || !newEvent.endTime) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      type: newEvent.type,
      propertyId: newEvent.propertyId || undefined,
      propertyName: newEvent.propertyId ? propertyNameMap[newEvent.propertyId] : undefined,
      attendees: newEvent.attendees ? newEvent.attendees.split(',').map(a => a.trim()).filter(Boolean) : [],
      location: newEvent.location || undefined,
      status: 'scheduled',
      priority: newEvent.priority,
      createdBy: 'Manager',
      notes: newEvent.notes || undefined,
    };

    setEvents(prev => [...prev, event]);
    setSelectedDate(new Date(newEvent.date + 'T00:00:00'));
    setShowCreateEvent(false);
    setNewEvent({
      title: '',
      type: 'inspection',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      propertyId: '',
      priority: 'medium',
      location: '',
      attendees: '',
      notes: '',
    });
  };

  const todayEvents = getEventsForDate(new Date());
  const selectedDateEvents = getEventsForDate(selectedDate);

  const calendarDays = getCalendarDays();
  const weekDays = getWeekDays();
  const timeSlots = getTimeSlots();

  return (
    <div style={{
      padding: '30px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '8px'
        }}>
          Calendar & Scheduling
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage property inspections, maintenance, and appointments
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '12px' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    padding: '4px'
                  }}>
                    {day}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {calendarDays.slice(0, 35).map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isSelected = day.toDateString() === selectedDate.toDateString();
                  const hasEvents = getEventsForDate(day).length > 0;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#2d5a41' : isToday ? '#f0fdf4' : 'transparent',
                        color: isSelected ? 'white' : isToday ? '#2d5a41' : isCurrentMonth ? '#1f2937' : '#9ca3af',
                        fontWeight: isToday || isSelected ? '600' : '400',
                        position: 'relative',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected && !isToday) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        } else if (isToday && !isSelected) {
                          e.currentTarget.style.backgroundColor = '#f0fdf4';
                        }
                      }}
                    >
                      {day.getDate()}
                      {hasEvents && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: isSelected ? 'white' : '#2d5a41'
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock size={16} style={{ color: '#2d5a41' }} />
                Today's Agenda
                {todayEvents.length > 0 && (
                  <Badge variant="info" className="ml-2">
                    {todayEvents.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto">
              {todayEvents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {todayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventModal(true);
                      }}
                      style={{
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${getEventTypeColor(event.type)}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {getEventTypeIcon(event.type)}
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                          {event.title}
                        </span>
                        <Badge variant={getStatusBadgeVariant(event.status)} className="text-[10px]">
                          {event.status}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </div>
                      {event.propertyName && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          📍 {event.propertyName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  <Calendar size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                  <p style={{ fontSize: '14px' }}>No events scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button
                  size="sm"
                  variant="primary"
                  fullWidth
                  iconLeft={<Plus size={16} />}
                  onClick={() => setShowCreateEvent(true)}
                >
                  Schedule Event
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  iconLeft={<Home size={16} />}
                  onClick={() => {
                    setNewEvent(prev => ({ ...prev, type: 'inspection' }));
                    setShowCreateEvent(true);
                  }}
                >
                  Schedule Inspection
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  iconLeft={<Wrench size={16} />}
                  onClick={() => {
                    setNewEvent(prev => ({ ...prev, type: 'maintenance' }));
                    setShowCreateEvent(true);
                  }}
                >
                  Book Maintenance
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  iconLeft={<Users size={16} />}
                  onClick={() => {
                    setNewEvent(prev => ({ ...prev, type: 'meeting' }));
                    setShowCreateEvent(true);
                  }}
                >
                  Schedule Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ flex: 1 }}
        >
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (viewType === 'month') navigateMonth('prev');
                        else if (viewType === 'week') navigateWeek('prev');
                        else navigateDay('prev');
                      }}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={goToToday}
                    >
                      Today
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (viewType === 'month') navigateMonth('next');
                        else if (viewType === 'week') navigateWeek('next');
                        else navigateDay('next');
                      }}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>

                  <h2 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    {viewType === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    {viewType === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                    {viewType === 'day' && formatDate(currentDate)}
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <Search
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: '6px 8px 6px 32px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        width: '200px'
                      }}
                    />
                  </div>

                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value as any)}
                    style={{
                      padding: '6px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="all">All Events</option>
                    <option value="inspection">Inspections</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="meeting">Meetings</option>
                    <option value="showing">Showings</option>
                  </select>

                  <div style={{
                    display: 'flex',
                    backgroundColor: '#f1f5f9',
                    padding: '2px',
                    borderRadius: '6px'
                  }}>
                    {['month', 'week', 'day'].map((view) => (
                      <button
                        key={view}
                        onClick={() => setViewType(view as any)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          backgroundColor: viewType === view ? 'white' : 'transparent',
                          color: viewType === view ? '#2d5a41' : '#64748b',
                          textTransform: 'capitalize',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {view}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    iconLeft={<Plus size={16} />}
                    onClick={() => setShowCreateEvent(true)}
                  >
                    New Event
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-5 overflow-y-auto">
              {viewType === 'month' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '1px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                    <div
                      key={day}
                      style={{
                        padding: '16px 8px',
                        backgroundColor: '#f8fafc',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151'
                      }}
                    >
                      {day}
                    </div>
                  ))}

                  {calendarDays.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = day.toDateString() === new Date().toDateString();
                    const dayEvents = getEventsForDate(day);

                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDate(day)}
                        style={{
                          minHeight: '120px',
                          backgroundColor: 'white',
                          padding: '8px',
                          cursor: 'pointer',
                          position: 'relative',
                          opacity: isCurrentMonth ? 1 : 0.4,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '4px'
                        }}>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: isToday ? '600' : '400',
                            color: isToday ? '#2d5a41' : '#1f2937'
                          }}>
                            {day.getDate()}
                          </span>
                          {isToday && (
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#2d5a41'
                            }} />
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                                setShowEventModal(true);
                              }}
                              style={{
                                padding: '2px 6px',
                                backgroundColor: getEventTypeColor(event.type),
                                color: 'white',
                                borderRadius: '3px',
                                fontSize: '11px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div style={{
                              fontSize: '10px',
                              color: '#6b7280',
                              textAlign: 'center',
                              marginTop: '2px'
                            }}>
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {viewType === 'week' && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px repeat(7, 1fr)',
                    gap: '1px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '8px 8px 0 0',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '16px 8px',
                      backgroundColor: '#f8fafc',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      Time
                    </div>
                    {weekDays.map(day => (
                      <div
                        key={day.toDateString()}
                        style={{
                          padding: '16px 8px',
                          backgroundColor: '#f8fafc',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151'
                        }}
                      >
                        <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div style={{ fontSize: '12px', fontWeight: '400', color: '#6b7280' }}>
                          {day.getDate()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px repeat(7, 1fr)',
                    gap: '1px',
                    backgroundColor: '#e5e7eb',
                    maxHeight: '600px',
                    overflowY: 'auto'
                  }}>
                    {Array.from({ length: 24 }, (_, hour) => (
                      <React.Fragment key={hour}>
                        <div style={{
                          padding: '8px',
                          backgroundColor: '#f8fafc',
                          fontSize: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                          borderTop: '1px solid #e5e7eb'
                        }}>
                          {formatTime(`${hour.toString().padStart(2, '0')}:00`)}
                        </div>
                        {weekDays.map(day => {
                          const hourEvents = getEventsForDate(day).filter(event => {
                            const eventHour = parseInt(event.startTime.split(':')[0]);
                            return eventHour === hour;
                          });

                          return (
                            <div
                              key={`${day.toDateString()}-${hour}`}
                              style={{
                                minHeight: '60px',
                                backgroundColor: 'white',
                                padding: '4px',
                                borderTop: '1px solid #e5e7eb',
                                position: 'relative'
                              }}
                            >
                              {hourEvents.map(event => (
                                <div
                                  key={event.id}
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setShowEventModal(true);
                                  }}
                                  style={{
                                    padding: '4px 6px',
                                    backgroundColor: getEventTypeColor(event.type),
                                    color: 'white',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    marginBottom: '2px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {event.title}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {viewType === 'day' && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px 8px 0 0',
                    marginBottom: '1px'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {formatDate(currentDate)}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                      {selectedDateEvents.length} events scheduled
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr',
                    gap: '1px',
                    backgroundColor: '#e5e7eb',
                    maxHeight: '600px',
                    overflowY: 'auto'
                  }}>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const hourEvents = selectedDateEvents.filter(event => {
                        const eventHour = parseInt(event.startTime.split(':')[0]);
                        return eventHour === hour;
                      });

                      return (
                        <React.Fragment key={hour}>
                          <div style={{
                            padding: '16px 8px',
                            backgroundColor: '#f8fafc',
                            fontSize: '12px',
                            color: '#6b7280',
                            textAlign: 'center',
                            borderTop: '1px solid #e5e7eb'
                          }}>
                            {formatTime(`${hour.toString().padStart(2, '0')}:00`)}
                          </div>
                          <div style={{
                            minHeight: '80px',
                            backgroundColor: 'white',
                            padding: '8px',
                            borderTop: '1px solid #e5e7eb',
                            position: 'relative'
                          }}>
                            {hourEvents.map(event => (
                              <div
                                key={event.id}
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setShowEventModal(true);
                                }}
                                style={{
                                  padding: '8px 12px',
                                  backgroundColor: getEventTypeColor(event.type),
                                  color: 'white',
                                  borderRadius: '6px',
                                  marginBottom: '4px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              >
                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                                  {event.title}
                                </div>
                                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </div>
                                {event.propertyName && (
                                  <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>
                                    📍 {event.propertyName}
                                  </div>
                                )}
                              </div>
                            ))}
                            {hourEvents.length === 0 && (
                              <div style={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#9ca3af',
                                fontSize: '12px'
                              }}>
                                Available
                              </div>
                            )}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  Event Details
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button size="sm" variant="outline" iconLeft={<Edit size={16} />} onClick={() => {
                    setNewEvent({
                      title: selectedEvent.title,
                      type: selectedEvent.type,
                      description: selectedEvent.description,
                      date: selectedEvent.date,
                      startTime: selectedEvent.startTime,
                      endTime: selectedEvent.endTime,
                      propertyId: selectedEvent.propertyId || '',
                      priority: selectedEvent.priority,
                      location: selectedEvent.location || '',
                      attendees: selectedEvent.attendees.join(', '),
                      notes: selectedEvent.notes || '',
                    });
                    setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
                    setShowEventModal(false);
                    setSelectedEvent(null);
                    setShowCreateEvent(true);
                  }}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" iconLeft={<Trash2 size={16} />} onClick={() => {
                    setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
                    setShowEventModal(false);
                    setSelectedEvent(null);
                  }}>
                    Delete
                  </Button>
                  <button
                    onClick={() => setShowEventModal(false)}
                    style={{
                      padding: '8px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      padding: '8px',
                      backgroundColor: getEventTypeColor(selectedEvent.type),
                      borderRadius: '6px',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getEventTypeIcon(selectedEvent.type)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                        {selectedEvent.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <Badge variant={getStatusBadgeVariant(selectedEvent.status)} className="text-[10px]">
                          {selectedEvent.status}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(selectedEvent.priority)} className="text-[10px]">
                          {selectedEvent.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {selectedEvent.description}
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px'
                }}>
                  <div>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      Date & Time
                    </h5>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      📅 {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                      🕒 {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                        Location
                      </h5>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        📍 {selectedEvent.location}
                      </div>
                    </div>
                  )}
                </div>

                {selectedEvent.propertyName && (
                  <div>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      Property
                    </h5>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      🏠 {selectedEvent.propertyName}
                    </div>
                  </div>
                )}

                <div>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    Attendees
                  </h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedEvent.attendees.map((attendee, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '16px',
                          fontSize: '12px',
                          color: '#374151'
                        }}
                      >
                        <User size={12} />
                        {attendee}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedEvent.notes && (
                  <div>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      Notes
                    </h5>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {selectedEvent.notes}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <Button variant="primary" fullWidth iconLeft={<CheckCircle size={16} />} onClick={() => {
                    setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...e, status: 'completed' as const } : e));
                    setShowEventModal(false);
                    setSelectedEvent(null);
                  }}>
                    Mark Complete
                  </Button>
                  <Button variant="outline" fullWidth iconLeft={<Phone size={16} />} onClick={() => alert(`Attendees: ${selectedEvent.attendees.join(', ')}`)}>
                    Contact Attendees
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowCreateEvent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  Create New Event
                </h3>
                <button
                  onClick={() => setShowCreateEvent(false)}
                  style={{
                    padding: '8px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Event Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter event title..."
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Event Type
                    </label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="inspection">Property Inspection</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="meeting">Meeting</option>
                      <option value="showing">Property Showing</option>
                      <option value="appointment">Appointment</option>
                      <option value="deadline">Deadline</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Description
                  </label>
                  <textarea
                    placeholder="Event description..."
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Date
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Property (Optional)
                    </label>
                    <select
                      value={newEvent.propertyId}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, propertyId: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="">Select property...</option>
                      <option value="prop-1">Hillpointe Manor #12A</option>
                      <option value="prop-2">Garden View Apartments #3B</option>
                      <option value="prop-3">Sunset Plaza #7A</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Priority
                    </label>
                    <select
                      value={newEvent.priority}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, priority: e.target.value as CalendarEvent['priority'] }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Event location..."
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Attendees
                  </label>
                  <input
                    type="text"
                    placeholder="Add attendees (comma separated)..."
                    value={newEvent.attendees}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, attendees: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Additional notes..."
                    rows={2}
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => setShowCreateEvent(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    iconLeft={<Plus size={16} />}
                  >
                    Create Event
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarPage;
