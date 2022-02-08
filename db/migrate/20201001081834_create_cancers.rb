class CreateCancers < ActiveRecord::Migration[6.0]
    def change
      create_table :cancers do |t|

        t.string :cancer_type
        t.string :cancer_name
        t.string :data_source
        t.integer :number_of_related_projects
        t.integer :number_of_samples 
        t.string :sub_cancer
        t.string :primary_site
        
        t.timestamps
      end
    end
  end
  