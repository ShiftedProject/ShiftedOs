
import React, { useState, useCallback } from 'react';
import { KnowledgeArticle } from '../types';
import Button from './Button';
import Modal from './Modal';
import PlusIcon from './icons/PlusIcon';
import Tag from './Tag'; 

const initialArticles: KnowledgeArticle[] = [
  { id: 'KB-001', title: 'Onboarding New Team Members', content: 'Detailed SOP for onboarding new hires...\n\n- Step 1: ...\n- Step 2: ...', category: 'SOP', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['HR', 'Process'] },
  { id: 'KB-002', title: 'Brand Voice Guidelines', content: 'Our brand voice is friendly, professional, and insightful...\n\nKey Principles:\n- Clarity\n- Empathy\n- Authority', category: 'Guidelines', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['Branding', 'Marketing'] },
];

const KnowledgeBaseView: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(initialArticles);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newArticle, setNewArticle] = useState<Partial<KnowledgeArticle>>({
    title: '',
    content: '',
    category: 'General',
    tags: []
  });
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);
  const [viewingArticle, setViewingArticle] = useState<KnowledgeArticle | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "tags") {
        setNewArticle(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()).filter(tag => tag) }));
    } else {
        setNewArticle(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleOpenModal = (articleToEdit?: KnowledgeArticle) => {
    if (articleToEdit) {
      setEditingArticle(articleToEdit);
      setNewArticle({
        ...articleToEdit,
        tags: articleToEdit.tags || [] 
      });
    } else {
      setEditingArticle(null);
      setNewArticle({ title: '', content: '', category: 'General', tags: [] });
    }
    setViewingArticle(null);
    setIsModalOpen(true);
  };
  
  const handleOpenViewModal = (article: KnowledgeArticle) => {
    setViewingArticle(article);
    setIsModalOpen(false); 
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingArticle(null);
  }, []);
  
  const handleCloseViewModal = useCallback(() => {
    setViewingArticle(null);
  }, []);

  const handleSaveArticle = useCallback(() => {
    if (!newArticle.title || !newArticle.content || !newArticle.category) {
      alert("Title, Content, and Category are required.");
      return;
    }
    const now = new Date().toISOString();
    if (editingArticle) {
      setArticles(prev => prev.map(art => art.id === editingArticle.id ? { ...editingArticle, ...newArticle, updatedAt: now } as KnowledgeArticle : art));
    } else {
      const articleToAdd: KnowledgeArticle = {
        id: `KB-${String(Date.now()).slice(-4)}`,
        createdAt: now,
        updatedAt: now,
        ...newArticle,
      } as KnowledgeArticle;
      setArticles(prev => [articleToAdd, ...prev]);
    }
    handleCloseModal();
  }, [newArticle, editingArticle, handleCloseModal]);

  const handleDeleteArticle = (articleId: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      setArticles(prev => prev.filter(art => art.id !== articleId));
       if (viewingArticle?.id === articleId) { // Close view modal if deleted article was being viewed
        handleCloseViewModal();
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">Knowledge Base</h2>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon className="w-5 h-5" />} size="md" className="w-full sm:w-auto">
          New Article
        </Button>
      </div>
      
      {articles.length === 0 ? (
         <div className="bg-white rounded-xl p-8 shadow-glass-depth text-center border border-gray-200"> {/* Enhanced shadow */}
            <p className="text-text-secondary">No articles yet. Start documenting your processes and guidelines!</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {articles.map(article => (
            <div key={article.id} className="bg-white p-4 sm:p-5 rounded-xl shadow-glass-depth hover:shadow-strong transition-shadow duration-200 border border-gray-200/50 flex flex-col justify-between"> {/* Enhanced shadow */}
              <div>
                <h3 className="text-md sm:text-lg font-semibold text-text-primary mb-1 truncate" title={article.title}>{article.title}</h3>
                <Tag text={article.category} color="secondary" size="sm" className="mb-2"/>
                <p className="text-sm text-text-secondary mb-2 h-12 overflow-hidden line-clamp-2">{article.content}</p>
                {article.tags && article.tags.length > 0 && (
                    <div className="mb-2 max-h-10 overflow-y-auto">
                        {article.tags.map(tag => <Tag key={tag} text={tag} color="highlight" size="sm" className="mr-1 mb-1"/>)}
                    </div>
                )}
                <p className="text-xs text-gray-400">Last updated: {new Date(article.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => handleOpenViewModal(article)} size="sm" variant="ghost" className="flex-1 sm:flex-none">View</Button>
                <Button onClick={() => handleOpenModal(article)} size="sm" variant="ghost" className="flex-1 sm:flex-none">Edit</Button>
                <Button onClick={() => handleDeleteArticle(article.id)} size="sm" variant="danger" className="bg-transparent text-red-500 hover:bg-red-500/10 flex-1 sm:flex-none">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingArticle ? "Edit Article" : "Create New Article"} size="xl">
        <form onSubmit={(e) => { e.preventDefault(); handleSaveArticle(); }} className="space-y-4">
          <div>
            <label htmlFor="kbTitle" className="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <input type="text" name="title" id="kbTitle" value={newArticle.title || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" />
          </div>
          <div>
            <label htmlFor="kbCategory" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
            <input type="text" name="category" id="kbCategory" value={newArticle.category || 'General'} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="e.g., SOP, Guideline, Tutorial"/>
          </div>
          <div>
            <label htmlFor="kbContent" className="block text-sm font-medium text-text-secondary mb-1">Content (Markdown supported conceptually)</label>
            <textarea name="content" id="kbContent" value={newArticle.content || ''} onChange={handleInputChange} required rows={8} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"></textarea>
          </div>
           <div>
            <label htmlFor="kbTags" className="block text-sm font-medium text-text-secondary mb-1">Tags (comma-separated)</label>
            <input type="text" name="tags" id="kbTags" value={newArticle.tags?.join(', ') || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="e.g., HR, onboarding, design"/>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="w-full sm:w-auto">Cancel</Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">{editingArticle ? "Save Changes" : "Create Article"}</Button>
          </div>
        </form>
      </Modal>

      {viewingArticle && (
        <Modal isOpen={!!viewingArticle} onClose={handleCloseViewModal} title={viewingArticle.title} size="xl">
            <div className="space-y-3">
                <div>
                    <span className="text-sm font-medium text-text-secondary">Category: </span>
                    <Tag text={viewingArticle.category} color="secondary" size="sm"/>
                </div>
                 {viewingArticle.tags && viewingArticle.tags.length > 0 && (
                    <div>
                        <span className="text-sm font-medium text-text-secondary">Tags: </span>
                        {viewingArticle.tags.map(tag => <Tag key={tag} text={tag} color="highlight" size="sm" className="mr-1 mb-1"/>)}
                    </div>
                )}
                <div className="prose prose-sm sm:prose-base max-w-none text-text-primary whitespace-pre-wrap">{viewingArticle.content}</div>
                <p className="text-xs text-gray-400 mt-4">
                    Created: {new Date(viewingArticle.createdAt).toLocaleString()} | Updated: {new Date(viewingArticle.updatedAt).toLocaleString()}
                </p>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <Button type="button" variant="ghost" onClick={() => { handleOpenModal(viewingArticle); }} className="w-full sm:w-auto">Edit</Button>
                    <Button type="button" variant="primary" onClick={handleCloseViewModal} className="w-full sm:w-auto">Close</Button>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default KnowledgeBaseView;