class CreateCancers < ActiveRecord::Migration[6.0]
    def change
      create_table :cancers do |t|

        t.string :cancer_type
        t.integer :number_of_related_projects
        t.integer :number_of_samples 
        t.string :related_projects
        t.string :database
        

        t.timestamps
      end
    end
  end
  