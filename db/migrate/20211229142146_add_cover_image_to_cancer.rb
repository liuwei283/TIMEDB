class AddCoverImageToCancer < ActiveRecord::Migration[6.0]
  def change
    add_column :cancers, :cover_image, :text  
  end
end
