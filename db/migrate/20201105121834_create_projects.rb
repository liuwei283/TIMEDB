class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.string :project_name
      #t.string :primary_site
      t.string :cancer_type
      t.integer :number_of_samples
      t.integer :number_of_oberserved_genes
      t.string :preprocessed
      t.text :original_description
      t.string :platform 
      t.string :submisson_date
      t.string :last_update_date
      t.string :database
      t.string :original_link 
      t.string :major_related_publications
      t.string :publications_link
      
      #t.references :organ, null: false, foreign_key: true
      t.references :cancer, null:false, foreign_key: true

      t.timestamps
    end
  end
end
