import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Download,
  FileText,
  Image,
  File,
  Folder,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Edit,
  Share2,
  Grid,
  List,
  Plus,
  X,
  Calendar
} from 'lucide-react';
import { documentsApi } from '../services/api';
import { formatFileSize, formatDateTime } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';

interface Document {
  id: string;
  name: string;
  type: 'lease' | 'invoice' | 'receipt' | 'insurance' | 'other';
  category: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  propertyId?: string;
  tenantId?: string;
  url: string;
  preview?: string;
}

const DocumentsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const documents: Document[] = [
    {
      id: '1',
      name: 'Lease Agreement - Sunset Villa 101.pdf',
      type: 'lease',
      category: 'Legal',
      size: 2400000,
      uploadedBy: 'John Doe',
      uploadedAt: '2026-01-20T10:30:00Z',
      propertyId: 'prop1',
      tenantId: 'tenant1',
      url: '/docs/lease1.pdf',
      preview: '/previews/lease1.jpg'
    },
    {
      id: '2',
      name: 'January Invoice - Oak Manor 205.pdf',
      type: 'invoice',
      category: 'Financial',
      size: 850000,
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2026-01-18T14:20:00Z',
      propertyId: 'prop2',
      url: '/docs/invoice1.pdf'
    },
    {
      id: '3',
      name: 'Property Insurance Policy.pdf',
      type: 'insurance',
      category: 'Insurance',
      size: 1200000,
      uploadedBy: 'Mike Chen',
      uploadedAt: '2026-01-15T09:15:00Z',
      url: '/docs/insurance1.pdf'
    },
    {
      id: '4',
      name: 'Maintenance Receipt - Plumbing.jpg',
      type: 'receipt',
      category: 'Maintenance',
      size: 450000,
      uploadedBy: 'Emma Wilson',
      uploadedAt: '2026-01-12T16:45:00Z',
      propertyId: 'prop3',
      url: '/docs/receipt1.jpg',
      preview: '/previews/receipt1.jpg'
    },
    {
      id: '5',
      name: 'Background Check Report.pdf',
      type: 'other',
      category: 'Screening',
      size: 950000,
      uploadedBy: 'David Brown',
      uploadedAt: '2026-01-10T11:30:00Z',
      tenantId: 'tenant2',
      url: '/docs/background1.pdf'
    },
    {
      id: '6',
      name: 'Property Photos - Birch Gardens.zip',
      type: 'other',
      category: 'Marketing',
      size: 15600000,
      uploadedBy: 'Lisa Garcia',
      uploadedAt: '2026-01-08T13:20:00Z',
      propertyId: 'prop4',
      url: '/docs/photos1.zip'
    }
  ];

  const stats = [
    { label: 'Total Documents', value: documents.length, icon: FileText },
    { label: 'Storage Used', value: '127.5 MB', icon: Folder },
    { label: 'Recent Uploads', value: '12', icon: Upload },
    { label: 'Shared Documents', value: '8', icon: Share2 }
  ];

  const documentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'lease', label: 'Lease Agreements' },
    { value: 'invoice', label: 'Invoices' },
    { value: 'receipt', label: 'Receipts' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'other', label: 'Other' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Financial', label: 'Financial' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Screening', label: 'Screening' }
  ];

  const getFileIcon = (document: Document) => {
    const extension = document.name.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <Image size={20} color="#10b981" />;
    } else if (['pdf'].includes(extension || '')) {
      return <FileText size={20} color="#ef4444" />;
    } else {
      return <File size={20} color="#6b7280" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  return (
    <div style={{ padding: '30px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            Document Management
          </h1>
          <button
            onClick={() => setShowUploadModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#2d5a41',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Upload size={16} />
            Upload Documents
          </button>
        </div>
        <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
          Store, organize, and manage all your property-related documents
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e5e5e5'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#f0f7f4',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={20} color="#2d5a41" />
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '20px',
          border: '1px solid #e5e5e5'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999'
                }}
              />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 12px 10px 36px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  width: '220px'
                }}
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '4px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: viewMode === 'grid' ? '#2d5a41' : '#666'
                }}
              >
                <Grid size={14} />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: viewMode === 'list' ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: viewMode === 'list' ? '#2d5a41' : '#666'
                }}
              >
                <List size={14} />
                List
              </button>
            </div>
          </div>
        </div>

        {selectedDocuments.length > 0 && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: '#f0f7f4',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '14px', color: '#2d5a41', fontWeight: '500' }}>
              {selectedDocuments.length} document(s) selected
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: '#2d5a41',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                <Download size={14} />
                Download
              </button>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        {viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid #e5e5e5',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  height: '160px',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#e5e5e5',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getFileIcon(document)}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: selectedDocuments.includes(document.id) ? '#2d5a41' : 'white',
                      border: `2px solid ${selectedDocuments.includes(document.id) ? '#2d5a41' : '#e5e5e5'}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDocumentSelection(document.id);
                    }}
                  >
                    {selectedDocuments.includes(document.id) && (
                      <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                    )}
                  </div>

                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer'
                  }}>
                    <MoreVertical size={16} color="#666" />
                  </div>
                </div>

                <div style={{ padding: '16px' }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0',
                    lineHeight: '1.4'
                  }}>
                    {document.name}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#2d5a41',
                      backgroundColor: '#f0f7f4',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {document.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {formatFileSize(document.size)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Calendar size={12} color="#999" />
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {formatDate(document.uploadedAt)}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                    Uploaded by {document.uploadedBy}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e5e5',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 120px 100px 140px 100px',
              padding: '16px 20px',
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e5e5e5',
              fontSize: '12px',
              fontWeight: '600',
              color: '#666'
            }}>
              <span></span>
              <span>Name</span>
              <span>Type</span>
              <span>Size</span>
              <span>Uploaded By</span>
              <span>Date</span>
            </div>

            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 120px 100px 140px 100px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #f0f0f0',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: selectedDocuments.includes(document.id) ? '#2d5a41' : 'white',
                    border: `2px solid ${selectedDocuments.includes(document.id) ? '#2d5a41' : '#e5e5e5'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDocumentSelection(document.id);
                  }}
                >
                  {selectedDocuments.includes(document.id) && (
                    <span style={{ color: 'white', fontSize: '10px' }}>✓</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getFileIcon(document)}
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                    {document.name}
                  </span>
                </div>

                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#2d5a41',
                  backgroundColor: '#f0f7f4',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  {document.type.toUpperCase()}
                </span>

                <span style={{ fontSize: '12px', color: '#666' }}>
                  {formatFileSize(document.size)}
                </span>

                <span style={{ fontSize: '12px', color: '#666' }}>
                  {document.uploadedBy}
                </span>

                <span style={{ fontSize: '12px', color: '#666' }}>
                  {formatDate(document.uploadedAt)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '500px',
            maxWidth: '90vw'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                Upload Documents
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
              >
                <X size={20} color="#666" />
              </button>
            </div>

            <div style={{
              border: '2px dashed #e5e5e5',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <Upload size={40} color="#999" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '16px', color: '#1a1a1a', margin: '0 0 8px 0' }}>
                Drag & drop files here, or click to browse
              </p>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                Supports PDF, JPG, PNG, ZIP files up to 10MB
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#2d5a41',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Upload Files
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;