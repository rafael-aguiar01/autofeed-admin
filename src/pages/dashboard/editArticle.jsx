import React, { useState, useEffect } from "react";
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Card from "@/components/ui/Card";
import { stateFromHTML } from 'draft-js-import-html';

import Button from "@/components/ui/Button";
import Select from "react-select";
import Fileinput from "@/components/ui/Fileinput";
import { useUpdateArticleMutation, useUploadImageMutation, useFetchArticleBySlugQuery } from "../../store/api/article/articleApiSlice"
import Textinputupdate from "@/components/ui/Textinputupdate";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw, convertFromRaw, convertFromHTML } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const visibleOptions = [
  { value: 'manchete', label: 'Manchete' },
  { value: 'grupo1', label: 'Grupo 1' },
  { value: 'grupo2', label: 'Grupo 2' },
  { value: 'grupo3', label: 'Grupo 3' },
  { value: 'grupo4', label: 'Grupo 4' },
  { value: 'grupo5', label: 'Grupo 5' },
  { value: 'grupo6', label: 'Grupo 6' },
  { value: 'grupo7', label: 'Grupo 7' }
];

const categories = [
  { value: 1, label: "Política" },
  { value: 2, label: "Polícia" },
  { value: 3, label: "Famosos" },
  { value: 4, label: "Economia" },
  { value: 5, label: "Internacional" },
  { value: 6, label: "Cidades" },
  { value: 7, label: "Esportes" }
];

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const EditArticle = () => {
  const { slug } = useParams();
  const { data: articleObject, isLoadingArticle, isError } = useFetchArticleBySlugQuery(slug)
  const [updateArticle, { isLoading }] = useUpdateArticleMutation();
  const [articleData, setArticleData] = useState({})
  const [valueIsCategory, setValueIsCategory] = useState(null)
  const [valueIsVisible, setValueIsVisible] = useState(null)
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [uploadImage] = useUploadImageMutation();
  const { control, register, setValue, handleSubmit, formState: { errors }, reset } = useForm();

  const article = articleObject?.article

  useEffect(() => {
    if (article) {
      setArticleData(article)
      const contentState = stateFromHTML(article.content || '');
      setEditorState(EditorState.createWithContent(contentState));
      const category = categories.find(cat => cat.value === article?.category?.id);
      setValueIsCategory(category || null);
      const visible = visibleOptions.find(visible => visible.value === article.visible)
      setValueIsVisible(visible || null)
    }
  }, [article])

  const handleInputChange = (content, editor) => {
    if (typeof content === 'string' && editor && editor.id) {
      setArticleData(prevData => ({ ...prevData, [editor.id]: content }));

    } else {
      const { name, value } = content.target;
      setArticleData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const contentState = editorState.getCurrentContent();
    setArticleData(prevData => ({
      ...prevData,
      content: JSON.stringify(convertToRaw(contentState))
    }));
  };

  const handleFileChange2 = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await uploadImage(formData).unwrap();
        setArticleData(prevData => ({ ...prevData, featureImg: response.imageUrl }));
      } catch (error) {
        console.error('Erro ao carregar a imagem:', error);
      }
    }
  };

  const handleSubmitArticle = async () => {
    const tokenFromLocalStorage = localStorage.getItem("token");

    if (!tokenFromLocalStorage) {
      console.error("Token não encontrado.");
      return;
    }

    const formData = {
      ...articleData,
    };

    try {
      console.log(formData)
      await updateArticle({ slug, article: formData, token: tokenFromLocalStorage }).unwrap();
      window.location.href = `/dashboard`
    } catch (error) {
      console.error("Falha ao criar o artigo:", error);
      alert("Erro ao criar o artigo.");
    }
  };

  return (
    <div>
      <Card title="Editar Notícia">
        <form onSubmit={handleSubmitArticle}>
          <div className="space-y-4">
            <Textinputupdate
              label="Título"
              name="title"
              id="title"
              type="text"
              placeholder="Escreva o título da notícia aqui"
              value={articleData.title}
              register={register('title')}
              onChange={handleInputChange}
            />
            <Textinputupdate
              label="Subtítulo"
              name="excerpt"
              id="excerpt"
              type="text"
              placeholder="Escreva o subtítulo da notícia aqui"
              value={articleData.excerpt}
              register={register('excerpt')}
              onChange={handleInputChange}
            />
            <label htmlFor=" hh2" className="form-label ">
              Categoria
            </label>
            <Controller
              name="cate"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={categories}
                  className="react-select"
                  classNamePrefix="select"
                  isClearable
                  styles={styles}
                  value={valueIsCategory}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    setArticleData(prevData => ({ ...prevData, cate: selectedOption ? selectedOption.value : '' }));
                  }}
                />
              )}
            />
            <label htmlFor=" hh2" className="form-label ">
              Seção
            </label>
            <Controller
              name="visible"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={visibleOptions}
                  className="react-select"
                  classNamePrefix="select"
                  isClearable
                  styles={styles}
                  value={valueIsVisible}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    setArticleData(prevData => ({ ...prevData, visible: selectedOption ? selectedOption.value : '' }));
                  }}
                  id="visible"
                />
              )}
            />
            <label htmlFor=" hh2" className="form-label ">
              Imagem Principal
            </label>
            <div className="input-group">
              <Fileinput
                type="file"
                className="form-control"
                name="featureImg"
                onChange={handleFileChange2}
              />
              {articleData && (
                <img src={articleData.featureImg} alt="Feature" className="img-thumbnail mt-2" />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="content" className="form-label">Conteúdo</label>
              <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
              />
            </div>
            <div className=" space-y-4">
              <Button text="Atualizar" className="btn-dark" onClick={handleSubmitArticle} />
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditArticle;
