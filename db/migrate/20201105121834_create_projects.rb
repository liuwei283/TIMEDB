class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.string :project_name
      t.string :primary_site
      t.integer :num_of_samples
      t.integer :num_of_oberserved_genes
      t.text :original_description
      t.text :major_related_publications
      t.integer :year
      t.string :original_link
      t.string :details
      t.string :orignial_dataset
      t.references :organ, null: false, foreign_key: true

      t.timestamps
    end
  end
end
