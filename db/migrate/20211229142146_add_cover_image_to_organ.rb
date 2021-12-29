class AddCoverImageToOrgan < ActiveRecord::Migration[6.0]
  def change
    add_column :organs, :cover_image, :text  
  end
end
