import React, { useEffect, useState } from "react";
import axios from 'axios';

function RecipeForm() {
    const [recipes, setRecipes] = useState([]);
    const [name, setName] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [favorite, setFavorite] = useState(false);
    const [error, setError] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [viewItem, setViewItem] = useState(null); // State for viewing a recipe

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = () => {
        axios
            .get('https://euphonious-beijinho-5d54a2.netlify.app/.netlify/functions/api/')
            .then((response) => {
                setRecipes(response.data);
            })
            .catch((error) => {
                console.error('There was an error!', error);
                setError('Failed to fetch recipes');
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !cuisine || !ingredients) {
            setError('Name, cuisine, and ingredients are required');
            return;
        }

        const url = editItem
            ? `https://euphonious-beijinho-5d54a2.netlify.app/.netlify/functions/api/${editItem._id}`
            : 'https://euphonious-beijinho-5d54a2.netlify.app/.netlify/functions/api';
        const method = editItem ? 'put' : 'post';

        const recipeData = { name, cuisine, ingredients, favorite };

        axios[method](url, recipeData)
            .then((response) => {
                console.log(response.data);
                fetchRecipes(); // Fetch updated list of recipes after adding/editing
                setName('');
                setCuisine('');
                setIngredients('');
                setFavorite(false);
                setEditItem(null);
                setError(null);
            })
            .catch((error) => {
                console.error('There was an error!', error);
                setError('There was an error submitting the data');
            });
    };

    const handleEdit = (_id) => {
        const recipeToEdit = recipes.find((recipe) => recipe._id === _id);
        setEditItem(recipeToEdit);
        setName(recipeToEdit.name);
        setCuisine(recipeToEdit.cuisine);
        setIngredients(recipeToEdit.ingredients);
        setFavorite(recipeToEdit.favorite);
    };

    const handleDelete = (_id) => {
        axios
            .delete(`https://euphonious-beijinho-5d54a2.netlify.app/.netlify/functions/api/${_id}`)
            .then(() => {
                fetchRecipes(); // Fetch updated list of recipes after deleting
            })
            .catch((error) => {
                console.error('There was an error!', error);
                setError('There was an error deleting the recipe');
            });
    };

    const handleView = (_id) => {
        const recipeToView = recipes.find((recipe) => recipe._id === _id);
        setViewItem(recipeToView);
    };

    return (
        <div className="recipe-form-container">
            <style>{`
                body {
                    background-color: #fafafa;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #333;
                }
                .recipe-form-container {
                    max-width: 800px;
                    margin: 40px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #fff;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                input, textarea {
                    padding: 12px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                    transition: border-color 0.2s;
                    background-color: #f9f9f9;
                    color: #333;
                }
                input:focus, textarea:focus {
                    border-color: #999;
                    outline: none;
                }
                button {
                    padding: 12px;
                    border: none;
                    border-radius: 4px;
                    background-color: #28a745;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                button:hover {
                    background-color: #218838;
                }
                ul {
                    list-style: none;
                    padding: 0;
                }
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #ddd;
                    transition: background-color 0.2s;
                    background-color: #f9f9f9;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                li:hover {
                    background-color: #f1f1f1;
                }
                .button-group {
                    display: flex;
                    gap: 8px;
                }
                .edit-button {
                    background-color: #ffc107;
                }
                .edit-button:hover {
                    background-color: #e0a800;
                }
                .delete-button {
                    background-color: #dc3545;
                }
                .delete-button:hover {
                    background-color: #c82333;
                }
                .view-button {
                    background-color: #17a2b8;
                }
                .view-button:hover {
                    background-color: #138496;
                }
                p {
                    color: #dc3545;
                    font-size: 14px;
                    margin-top: -10px;
                    margin-bottom: 20px;
                }
                .recipe-details {
                    border-top: 1px solid #ddd;
                    margin-top: 20px;
                    padding-top: 20px;
                    background-color: #fff;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    padding: 20px;
                }
                .recipe-details h3 {
                    margin-top: 0;
                    color: #333;
                }
            `}</style>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Recipe Name'
                />
                <input
                    type='text'
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder='Cuisine'
                />
                <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder='Ingredients (comma separated)'
                />
                <label>
                    <input
                        type='checkbox'
                        checked={favorite}
                        onChange={(e) => setFavorite(e.target.checked)}
                    />
                    Favorite
                </label>
                <button type='submit'>{editItem ? 'Update Recipe' : 'Add Recipe'}</button>
            </form>
            {error && <p>{error}</p>}
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        {recipe.name} - {recipe.cuisine}
                        <div className="button-group">
                            <button className="view-button" onClick={() => handleView(recipe._id)}>View</button>
                            <button className="edit-button" onClick={() => handleEdit(recipe._id)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(recipe._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            {viewItem && (
                <div className="recipe-details">
                    <h3>{viewItem.name}</h3>
                    <p><strong>Cuisine:</strong> {viewItem.cuisine}</p>
                    <p><strong>Ingredients:</strong> {viewItem.ingredients}</p>
                    <p><strong>Favorite:</strong> {viewItem.favorite ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    );
}

export default RecipeForm;
