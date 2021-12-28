class CreateOrgans < ActiveRecord::Migration[6.0]
    def change
      create_table :organs do |t|
        t.string :primary_site
        t.integer :num_of_projects
        t.text :project_list
        t.integer :num_of_samples
        t.string :data_type
        t.string :program
        
        t.timestamps
      end
    end
  end